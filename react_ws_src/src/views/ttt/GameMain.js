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
				wins: 0,
				losses: 0,
				draws: 0,
				startedFirstLastTime: true,
			}
		else {
			this.sock_start()

			this.state = {
				cell_vals_presentational: {},
				next_turn_ply: true,
				game_play: false,
				game_stat: 'Connecting',
				wins: 0,
				losses: 0,
				draws: 0,
				startedFirstLastTime: null,
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

			const iStart = data.mode=='m';

			this.setState({
				next_turn_ply: iStart,
				game_play: true,
				game_stat: 'Playing with ' + data.opp.name,
				startedFirstLastTime: iStart
			})

		}.bind(this));


		this.socket.on('opp_turn', this.turn_opp_live.bind(this));

		this.socket.on('new_game', () => {
			this.reset_for_new_game();
		});



	}

	componentWillUnmount () {
		this.socket && this.socket.disconnect();
	}


	render () {
		const { cell_vals_presentational, game_type, game_stat, game_play, next_turn_ply, wins, losses, draws } = this.state;
		const { winningCells, game_won, game_drawn } = gameLogic;
		//  console.log('u', winningCells, game_won, game_drawn)

		// console.log(this.state)

		return (
			<Board 
				cell_vals={cell_vals_presentational} 
				game_type={game_type} 
				game_stat={game_stat} 
				game_play={game_play} 
				next_turn_ply={next_turn_ply} 
				onClickCell={this.click_cell.bind(this)} 
				onEndGame={this.end_game.bind(this)}
				onNewGame={this.new_game.bind(this)}
				winningCells={winningCells} 
				wins={wins}
				losses={losses}
				draws={draws}
				gameEnded={game_won || game_drawn}
				/>
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
				wins: this.state.wins + 1,
			});
		}
		if (gameLogic.game_drawn) {
			this.setState({
				game_stat: 'Draw',
				game_play: false,
				draws: this.state.draws + 1,
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
				losses: this.state.losses + 1,
			});
		}
		if (gameLogic.game_drawn) {
			this.setState({
				game_stat: 'Draw',
				game_play: false,
				draws: this.state.draws + 1,
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
				losses: this.state.losses + 1,
			});
		}
		if (gameLogic.game_drawn) {
			this.setState({
				game_stat: 'Draw',
				game_play: false,
				draws: this.state.draws + 1,
			});
		}
	}

	end_game () {
		this.socket && this.socket.disconnect();

		this.props.onEndGame()
	}

	new_game () {
		this.reset_for_new_game();
		if (this.props.game_type == 'live') {
			this.socket.emit('new_game');
		}
		
	}

	reset_for_new_game () {
		gameLogic.reset();

		let iStart = !this.state.startedFirstLastTime;

		if (this.props.game_type != 'live')
			this.setState({
				cell_vals_presentational: {},
				next_turn_ply: iStart,
				game_play: true,
				game_stat: 'Start game',
				startedFirstLastTime: iStart,
			});

			if (!iStart && this.props.game_type != 'live') {
				setTimeout(this.turn_comp.bind(this), rand_to_fro(500, 1000));
			}
		else {
			this.setState({
				cell_vals_presentational: {},
				next_turn_ply: iStart,
				game_play: true,
				game_stat: 'Start game',
				startedFirstLastTime: iStart,
			});
		}
	}



}
