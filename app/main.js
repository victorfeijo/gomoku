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
        layer: true,
        draggable: true,
        fillStyle: "green",
        x: 60*i, y: 60*j,
        radius: 10,
        mouseover: function(layer) {
          $(this).animateLayer(layer, {
            fillStyle: '#c33'
          }, 500);
        },
        mouseout: function(layer) {
          $(this).animateLayer(layer, {
            fillStyle: '#fff'
          }, 500);
        },
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
