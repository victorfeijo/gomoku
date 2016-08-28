import { Enum } from './enum'
import Board from './board'

class Gomoku {

  constructor(playerName) {
    this.playerName = playerName
    this.board = new Board()
    this.whoStart = Math.round(Math.random())
  }

  setup() {
    // create board, pieces, set initial state to game, etc
    this.board.forEach((value, i, j, board) => {
      board[i][j] = 'Blank Piece'
    })
  }

  start() {
    // main loop game
    this.board.forEach((value, i, j, board) => {
      $('canvas').drawArc({
        fillStyle: 'black',
        x: i*80, y: j*100,
        radius: 5
      });
    })
  }

  reset() {
    // reset game
  }
}

const gomoku = new Gomoku()
gomoku.setup()
gomoku.start()

