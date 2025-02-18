import rand_arr_elem from '../../helpers/rand_arr_elem'
import rand_to_fro from '../../helpers/rand_to_fro'

const WIN_SETS = [
	['c1', 'c2', 'c3'],
	['c4', 'c5', 'c6'],
	['c7', 'c8', 'c9'],

	['c1', 'c4', 'c7'],
	['c2', 'c5', 'c8'],
	['c3', 'c6', 'c9'],

	['c1', 'c5', 'c9'],
	['c3', 'c5', 'c7']
]



export default class GameLogic {

	constructor() {
		this.reset();
	}

	reset() {
		this.cell_vals = {};
		this.game_won = false;
		this.game_drawn = false;
		this.winningCells = {};
	}

	/**
	 * @param {string} cell_id 
	 * @param {'x' | 'o'} type 
	 */
	turn(cell_id, type) {
		if (this.game_won || this.game_drawn) throw new Error('Game already finished');
		if (this.cell_vals[cell_id]) throw new Error('Spot taken');

		this.changeCell(cell_id, type);

		this.check_turn()
	}

	/**
	 * @param {string} cell_id 
	 * @param {'x' | 'o'} type 
	 */
	turn_comp(type) {
		if (this.game_won || this.game_drawn) throw new Error('Game already finished');

		let empty_cells_arr = []
		for (let i = 1; i <= 9; i++)
			!this.cell_vals['c' + i] && empty_cells_arr.push('c' + i)
		const c = rand_arr_elem(empty_cells_arr)

		this.changeCell(c, type);

		this.check_turn()
	}

	check_turn() {
		console.log('cell_vals', this.cell_vals);

		let win = false
		let set
		let fin = true

		for (let i = 0; !win && i < WIN_SETS.length; i++) {
			set = WIN_SETS[i]
			if (this.cell_vals[set[0]] && this.cell_vals[set[0]] == this.cell_vals[set[1]] && this.cell_vals[set[0]] == this.cell_vals[set[2]])
				win = true
		}

		for (let i = 1; i <= 9; i++) {
			if (this.cell_vals['c' + i] && this.cell_vals['c' + i] != '') {
				fin = false;
			}
		}

		if (win) {
			this.game_won = true;
			this.game_drawn = false;
			this.winningCells = { [set[0]]: true, [set[1]]: true, [set[2]]: true }
			console.log('win: ', this.winningCells)

		} else if (fin) {
			this.game_won = false;
			this.game_drawn = true;
			console.log('game drawn');
		}


	}

	changeCell(cell_id, value) {
		const newCellVals = Object.assign({}, this.cell_vals);
		newCellVals[cell_id] = value;
		this.cell_vals = newCellVals;
		console.log(this);
	}

}
