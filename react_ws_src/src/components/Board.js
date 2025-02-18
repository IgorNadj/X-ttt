import React, {Component} from 'react'

import TweenMax from 'gsap'



export default class Board extends Component {

    constructor(props) {
        super(props);
    } 

    componentDidMount() {
        TweenMax.from('#game_stat', 1, { display: 'none', opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeIn })
        TweenMax.from('#game_board', 1, { display: 'none', opacity: 0, x: -200, y: -200, scaleX: 0, scaleY: 0, ease: Power4.easeIn })
    }

    componentDidUpdate(prevProps) {
        for (const cell_id of Object.keys(this.props.cell_vals)) {
            if (!prevProps.cell_vals[cell_id]) {
                TweenMax.from(this.refs[cell_id], 0.7, {opacity: 0, scaleX:0, scaleY:0, ease: Power4.easeOut})
            }
        }
    }

    render () {
        const { cell_vals, game_type, game_stat, game_play, next_turn_ply, onClickCell, onEndGame, onNewGame, winningCells, wins, losses, draws, gameEnded } = this.props;

        const cell_cont = (c) => (<div>
            {cell_vals && cell_vals[c] == 'x' && <i className="fa fa-times fa-5x"></i>}
            {cell_vals && cell_vals[c] == 'o' && <i className="fa fa-circle-o fa-5x"></i>}
        </div>);



        return (
            <div id='GameMain'>

                <h1>Play {game_type}</h1>

                <div id="game_stat">
                    <div id="game_stat_msg">{game_stat}</div>
                    {game_play && <div id="game_turn_msg">{next_turn_ply ? 'Your turn' : 'Opponent turn'}</div>}
                </div>

                <div id="game_board">
                    <table>
                        <tbody>
                            <tr>
                                <td id='game_board-c1' ref="c1" className={winningCells['c1'] ? 'win' : null} onClick={() => onClickCell('c1')}> {cell_cont('c1')} </td>
                                <td id='game_board-c2' ref="c2" className={'vbrd ' + (winningCells['c2'] ? 'win' : null)} onClick={() => onClickCell('c2')}> {cell_cont('c2')} </td>
                                <td id='game_board-c3' ref="c3" className={winningCells['c3'] ? 'win' : null} onClick={() => onClickCell('c3')}> {cell_cont('c3')} </td>
                            </tr>
                            <tr>
                                <td id='game_board-c4' ref="c4" className={'hbrd ' + (winningCells['c4'] ? 'win' : null)} onClick={() => onClickCell('c4')}> {cell_cont('c4')} </td>
                                <td id='game_board-c5' ref="c5" className={'vbrd hbrd ' + (winningCells['c5'] ? 'win' : null)} onClick={() => onClickCell('c5')}> {cell_cont('c5')} </td>
                                <td id='game_board-c6' ref="c6" className={'hbrd ' + (winningCells['c6'] ? 'win' : null)} onClick={() => onClickCell('c6')}> {cell_cont('c6')} </td>
                            </tr>
                            <tr>
                                <td id='game_board-c7' ref="c7" className={winningCells['c7'] ? 'win' : null} onClick={() => onClickCell('c7')}> {cell_cont('c7')} </td>
                                <td id='game_board-c8' ref="c8" className={'vbrd ' + (winningCells['c8'] ? 'win' : null)} onClick={() => onClickCell('c8')}> {cell_cont('c8')} </td>
                                <td id='game_board-c9' ref="c9" className={winningCells['c9'] ? 'win' : null} onClick={() => onClickCell('c9')}> {cell_cont('c9')} </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div>
                    <div>Wins: {wins}</div>
                    <div>Losses: {losses}</div>
                    <div>Draws: {draws}</div>
                </div>

                <button type='submit' onClick={() => onEndGame()} className='button'><span>End Game <span className='fa fa-caret-right'></span></span></button>
                {gameEnded && <button type='submit' onClick={() => onNewGame()} className='button'><span>Play again <span className='fa fa-caret-right'></span></span></button>}

            </div>
        );
    }


}