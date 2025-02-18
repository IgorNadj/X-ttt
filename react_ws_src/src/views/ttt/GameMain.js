import React, {Component} from 'react'

import io from 'socket.io-client'

import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

import Board from '../../components/Board.js';
import GameLogic from './GameLogic.js';


const gameLogic = new GameLogic();


export default class SetName extends Component {

	constructor (props) {
		super(props)

		gameLogic.reset();

		if (this.props.game_type != 'live')
			this.state = {
				cell_vals_presentational: {},
				next_turn_ply: true,
				game_play: true,
				game_stat: 'Start game',
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals_presentational: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Connecting',
			}
		}
	}


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

	componentWillUnmount () {
		this.socket && this.socket.disconnect();
	}


	render () {
		const { cell_vals_presentational, game_type, game_stat, game_play, next_turn_ply } = this.state;
		const { winningCells } = gameLogic;

		// console.log(cell_vals_presentational)

		return (
			<Board 
				cell_vals={cell_vals_presentational} 
				game_type={game_type} 
				game_stat={game_stat} 
				game_play={game_play} 
				next_turn_ply={next_turn_ply} 
				onClickCell={this.click_cell.bind(this)} 
				onEndGame={this.end_game.bind(this)}
				winningCells={winningCells} />
		)
	}

	click_cell (cell_id) {
		if (!this.state.next_turn_ply || !this.state.game_play) return
		//if (this.state.gameLogic.cell_vals[cell_id]) return

		if (this.props.game_type != 'live') {
			this.turn_ply(cell_id)
			if (!gameLogic.game_won && !gameLogic.game_drawn) {
				setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));
			}
		} else{
			this.turn_ply(cell_id);
			this.setState({ next_turn_ply: false });
			this.socket.emit('ply_turn', { cell_id: cell_id });
		}
	}

	turn_ply (cell_id) {
		gameLogic.turn(cell_id, 'x');
		this.setState({ cell_vals_presentational: gameLogic.cell_vals });
		this.setState({ next_turn_ply: false });

		if (gameLogic.game_won) {
			this.setState({
				game_stat: 'You win',
				game_play: false,
			});
		}
		if (gameLogic.game_drawn) {
			this.setState({
				game_stat: 'Draw',
				game_play: false
			});
		}
	}

	turn_comp () {
		gameLogic.turn_comp('o');
		this.setState({ cell_vals_presentational: gameLogic.cell_vals });
		this.setState({ next_turn_ply: true });

		if (gameLogic.game_won) {
			this.setState({
				game_stat: 'Opponent win',
				game_play: false,
			});
		}
		if (gameLogic.game_drawn) {
			this.setState({
				game_stat: 'Draw',
				game_play: false
			});
		}
	}

	turn_opp_live (data) {
		const { cell_id } = data;
		gameLogic.turn(cell_id, 'o');
		this.setState({ cell_vals_presentational: gameLogic.cell_vals });
		this.setState({ next_turn_ply: true });

		if (gameLogic.game_won) {
			this.setState({
				game_stat: 'Opponent win',
				game_play: false,
			});
		}
		if (gameLogic.game_drawn) {
			this.setState({
				game_stat: 'Draw',
				game_play: false
			});
		}
	}

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}



}
