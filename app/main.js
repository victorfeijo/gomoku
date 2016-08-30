import { Players } from './players'
import { Enum } from './enum'
import { Type } from './type'
import Board from './board'
import Player from './player'

class Gomoku {

  constructor(playerName) {
    // this.playerName = playerName
    this.board = new Board()
    // this.whoStart = Math.round(Math.random())
  }

  setup() {
    // create board, pieces, set initial state to game, etc
    this.player = new Array(2)
    this.player[Players.ONE] = new Player("P1", Type.HUMAN, "#222")
    this.player[Players.TWO] = new Player("P2", Type.HUMAN, "#eee")
    this.draw()
    this.addCells()
    this.board.switchPlayer()
  }

  start() {
    // main loop game
  }

  reset() {
    // reset game
  }

  draw() {
    for (let i=0; i<Enum.BOARD_COLUMNS_NUMBER-1; i++) {
      for (let j=0; j<Enum.BOARD_ROWS_NUMBER-1; j++) {
        $('canvas').drawRect({
          layer: true,
          draggable: false,
          strokeStyle: '#422',
          strokeWidth: 2,
          x: 35*(i+1),
          y: 35*(j+1),
          width: 35,
          height: 35
        })
      }
    }
  }

  addCells() {
    let gomoku = this
    let board = this.board
    this.board.forEach((value, i, j) => {
      $('canvas').drawRect({
        layer: true,
        draggable: true,
        x: 35*(i+.5),
        y: 35*(j+.5),
        width: 35,
        height: 35,
        fillStyle: 'rgba(30, 150, 30, 0)',
        mouseover: function(layer) {
          if (gomoku.player[board.currentPlayer].type == Type.HUMAN) {
            $(this).animateLayer(layer, {
              fillStyle: 'rgba(30, 150, 30, 0.3)'
            }, Enum.ANIMATIONS_DURATION)
          }
        },
        mouseout: function(layer) {
          if (gomoku.player[board.currentPlayer].type == Type.HUMAN) {
            $(this).animateLayer(layer, {
              fillStyle: 'rgba(30, 150, 30, 0)'
            }, Enum.ANIMATIONS_DURATION)
          }
        },
        click: function(layer) {
          if (gomoku.player[board.currentPlayer].type == Type.HUMAN) {
            $(this).animateLayer(layer, {
              fillStyle: 'rgba(30, 150, 30, 0)'
            }, Enum.ANIMATIONS_DURATION)
            $(this).removeLayer(layer)
            gomoku.addPiece(i, j, board.currentPlayer)
          }
        },
      })
    })
  }

  addPiece(i, j, playerId) {
    this.board.set(i, j, playerId)
    let color = this.player[playerId].color
    $('canvas').drawArc({
      layer: true,
      draggable: true,
      x: 35*(i+.5),
      y: 35*(j+.5),
      radius: 15,
      fillStyle: color
    })
  }
}

const gomoku = new Gomoku()
gomoku.setup()
gomoku.start()
