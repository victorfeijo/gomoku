import { Players } from './enum'
import { Enum } from './enum'
import { Type } from './enum'
import Board from './board'
import Player from './player'

const CELL_WIDTH = Enum.BOARD_WIDTH / Enum.BOARD_COLUMNS_NUMBER
const CELL_HEIGHT = Enum.BOARD_HEIGHT / Enum.BOARD_ROWS_NUMBER

class Gomoku {

  constructor() {}

  setup() {
    // create board, pieces, set initial state to game, etc
    this.player = {}
    this.player[Players.ONE] = new Player("Preto", Type.HUMAN, "#222")
    this.player[Players.TWO] = new Player("Branco", Type.HUMAN, "#eee")
    this.drawBg()
  }

  start() {
    // main game
    this.board = new Board()
    this.drawCells()
    if (this.isAiRound()) {
      Ai.think()  // TODO
    }
  }

  reset() {
    // reset game
  }

  drawBg() {
    for (let i=0; i<Enum.BOARD_COLUMNS_NUMBER-1; i++)
    for (let j=0; j<Enum.BOARD_ROWS_NUMBER-1; j++) {
      $('canvas').drawRect({
        layer: true,
        draggable: false,
        strokeStyle: '#422',
        strokeWidth: 2,
        x: CELL_WIDTH*(i+1),
        y: CELL_HEIGHT*(j+1),
        width: CELL_WIDTH,
        height: CELL_HEIGHT
      })
    }
  }

  drawCells() {
    this.board.forEach((value, i, j) => {
      if (value == Players.NONE) {
        this.drawEmptyCell(i, j)
      } else {
        this.drawPiece(i, j, value)
      }
    })
  }

  drawEmptyCell(i, j) {
    let currentPlayer = this.player[this.board.currentPlayer()]
    let gomoku = this
    $('canvas').drawRect({
      layer: true,
      draggable: false,
      x: CELL_WIDTH*(i+.5),
      y: CELL_HEIGHT*(j+.5),
      width: CELL_WIDTH,
      height: CELL_HEIGHT,
      fillStyle: currentPlayer.color,
      opacity: 0,
      mouseover: function(layer) {
        if (currentPlayer.type == Type.HUMAN) {
          $(this).animateLayer(layer, {
            opacity: 0.4
          }, Enum.ANIMATIONS_DURATION)
        }
      },
      mouseout: function(layer) {
        $(this).animateLayer(layer, {
          opacity: 0
        }, Enum.ANIMATIONS_DURATION)
      },
      click: function(layer) {
        if (currentPlayer.type == Type.HUMAN) {
          $(this).animateLayer(layer, {
            opacity: 0
          }, Enum.ANIMATIONS_DURATION)
          gomoku.addPiece(i, j)
        }
      },
    })
  }

  drawPiece(i, j, playerId) {
    let color = this.player[playerId].color
    $('canvas').drawArc({
      layer: true,
      draggable: false,
      x: CELL_WIDTH*(i+.5),
      y: CELL_HEIGHT*(j+.5),
      radius: (CELL_WIDTH-5)/2,
      fillStyle: color
    })
  }

  addPiece(i, j) {
    this.board = this.board.addPiece(i, j)
    $('canvas').removeLayers()
    this.drawBg()
    this.drawCells()
    let winner = this.board.getWinner()
    if (winner != null) {
      if (winner == Players.NONE) {
        alert('DRAW')
      } else {
        let name = this.player[winner]
        alert('WINNER:\n'+name)
      }
    } else if (this.isAiRound()) {
      Ai.think()  // TODO
    }
  }

  isAiRound() {
    let currentId = this.board.currentPlayer()
    let currentPlayer = this.player[currentId]
    return currentPlayer.type == Type.AI
  }
}

const gomoku = new Gomoku()
gomoku.setup()
gomoku.start()
