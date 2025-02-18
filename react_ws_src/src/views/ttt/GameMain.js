import React, {Component} from 'react'

import io from 'socket.io-client'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

import Board from '../../components/Board.js';

export default class SetName extends Component {

	constructor (props) {
		super(props)

		console.log('x');

		this.win_sets = [
			['c1', 'c2', 'c3'],
			['c4', 'c5', 'c6'],
			['c7', 'c8', 'c9'],

			['c1', 'c4', 'c7'],
			['c2', 'c5', 'c8'],
			['c3', 'c6', 'c9'],

			['c1', 'c5', 'c9'],
			['c3', 'c5', 'c7']
		]


		if (this.props.game_type != 'live')
			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: true,
				game_stat: 'Start game',
				winningCells: {},
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Connecting',
				winningCells: {},
			}
		}
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	sock_start () {

		this.socket = io('http://localhost:3001');

		this.socket.on('connect', function(data) { 
			// console.log('socket connected', data)

			this.socket.emit('new player', { name: app.settings.curr_user.name });

		}.bind(this));

		this.socket.on('pair_players', function(data) { 
			// console.log('paired with ', data)

			this.setState({
				next_turn_ply: data.mode=='m',
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name
			})

		}.bind(this));


		this.socket.on('opp_turn', this.turn_opp_live.bind(this));



	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	componentWillUnmount () {
		this.socket && this.socket.disconnect();
	}

//	------------------------	------------------------	------------------------

	render () {
		const { cell_vals, game_type, game_stat, game_play, next_turn_ply, winningCells } = this.state
		// console.log(cell_vals)

		return (
			<Board 
				cell_vals={cell_vals} 
				game_type={game_type} 
				game_stat={game_stat} 
				game_play={game_play} 
				next_turn_ply={next_turn_ply} 
				onClickCell={this.click_cell.bind(this)} 
				onEndGame={this.end_game.bind(this)}
				winningCells={winningCells} />
		)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	click_cell (cell_id) {
		// console.log(e.currentTarget.id.substr(11))
		// console.log(e.currentTarget)

		if (!this.state.next_turn_ply || !this.state.game_play) return

		if (this.state.cell_vals[cell_id]) return

		if (this.props.game_type != 'live')
			this.turn_ply_comp(cell_id)
		else
			this.turn_ply_live(cell_id)
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_comp (cell_id) {

		let { cell_vals } = this.state
		const newCellVals = Object.assign({}, cell_vals);

		newCellVals[cell_id] = 'x';


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.setState({cell_vals: newCellVals});

		this.check_turn()
	}

//	------------------------	------------------------	------------------------

	turn_comp () {

		let { cell_vals } = this.state
		const newCellVals = Object.assign({}, cell_vals);

		let empty_cells_arr = []


		for (let i=1; i<=9; i++) 
			!cell_vals['c'+i] && empty_cells_arr.push('c'+i)
		// console.log(cell_vals, empty_cells_arr, rand_arr_elem(empty_cells_arr))

		const c = rand_arr_elem(empty_cells_arr)
		newCellVals[c] = 'o';

		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })

		this.setState({ cell_vals: newCellVals });

		this.check_turn()
	}


//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	turn_ply_live (cell_id) {

		let { cell_vals } = this.state

		const newCellVals = Object.assign({}, cell_vals);
		newCellVals[cell_id] = 'x';

		this.socket.emit('ply_turn', { cell_id: cell_id });

		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: false
		// })

		// setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

		this.setState({cell_vals: newCellVals});

		this.check_turn()
	}

//	------------------------	------------------------	------------------------

	turn_opp_live (data) {

		let { cell_vals } = this.state
		let empty_cells_arr = []


		const c = data.cell_id
		cell_vals[c] = 'o'


		// this.setState({
		// 	cell_vals: cell_vals,
		// 	next_turn_ply: true
		// })

		this.setState({cell_vals: cell_vals});

		this.check_turn()
	}

//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------
//	------------------------	------------------------	------------------------

	check_turn () {

		const { cell_vals } = this.state

		let win = false
		let set
		let fin = true

		if (this.props.game_type!='live')
			this.state.game_stat = 'Play'


		for (let i=0; !win && i<this.win_sets.length; i++) {
			set = this.win_sets[i]
			if (cell_vals[set[0]] && cell_vals[set[0]]==cell_vals[set[1]] && cell_vals[set[0]]==cell_vals[set[2]])
				win = true
		}


		for (let i=1; i<=9; i++) 
			!cell_vals['c'+i] && (fin = false)

		win && console.log('win set: ', set)

		if (win) {

			this.setState({
				game_stat: (cell_vals[set[0]]=='x'?'You':'Opponent')+' win',
				game_play: false,
				winningCells: {[set[0]]: true, [set[1]]: true, [set[2]]: true},
			})

			this.socket && this.socket.disconnect();

		} else if (fin) {
		
			this.setState({
				game_stat: 'Draw',
				game_play: false
			})

			this.socket && this.socket.disconnect();

		} else {
			this.props.game_type!='live' && this.state.next_turn_ply && setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));

			this.setState({
				next_turn_ply: !this.state.next_turn_ply
			})
		}
		
	}

//	------------------------	------------------------	------------------------

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}



}
