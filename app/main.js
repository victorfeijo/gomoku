import { Players, Enum, Type } from './enum'
import Board from './board'
import Player from './player'
import Ai from './ai'

const CELL_WIDTH = Enum.BOARD_WIDTH / Enum.BOARD_COLUMNS_NUMBER
const CELL_HEIGHT = Enum.BOARD_HEIGHT / Enum.BOARD_ROWS_NUMBER

class Gomoku {

  constructor() {
    this.ai = new Ai()
    $('#reset').click(() => { this.reset() })
  }

  setup() {
    // create board, pieces, set initial state to game, etc
    this.player = {}
    const p1Type = confirm("Player 1 will be a human") ? Type.HUMAN : Type.AI
    const p2Type = confirm("Player 2 will be an AI") ? Type.AI : Type.HUMAN
    this.player[Players.ONE] = new Player("Black", p1Type, "#222")
    this.player[Players.TWO] = new Player("White", p2Type, "#eee")
  }

  start() {
    // main game
    $('#reset').hide()
    this.drawBg()
    this.board = new Board()
    this.drawCells()
    if (this.isAiRound()) {
      setTimeout(() => {
        const aiMove = this.ai.think(this.board)
        this.addPiece(aiMove.i, aiMove.j)
      }, 50)
    }
  }

  reset() {
    // reset game
    $('canvas').removeLayers()
    $('canvas').clearCanvas()
    this.setup()
    this.start()
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
    let currentPlayerId = this.board.currentPlayer()
    if (currentPlayerId != Players.NONE) {
      let currentPlayer = this.player[currentPlayerId]
      if (currentPlayer.type == Type.HUMAN) {
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
            $(this).animateLayer(layer, {
              opacity: 0.4
            }, Enum.ANIMATIONS_DURATION)
          },
          mouseout: function(layer) {
            $(this).animateLayer(layer, {
              opacity: 0
            }, Enum.ANIMATIONS_DURATION)
          },
          click: function(layer) {
            gomoku.addPiece(i, j)
          },
        })
      }
    }
  }

  drawPiece(i, j, playerId) {
    let color = this.player[playerId].color
    let strkWidth = 0
    if (this.board.lastX() == i && this.board.lastY() == j) {
      strkWidth = 3
    }
    $('canvas').drawArc({
      strokeStyle: '#888',
      strokeWidth: strkWidth,
      layer: true,
      draggable: false,
      x: CELL_WIDTH*(i+.5),
      y: CELL_HEIGHT*(j+.5),
      radius: (CELL_WIDTH-5)/2,
      fillStyle: color
    })
  }

  addPiece(i, j) {
    $('canvas').removeLayers()
    $('canvas').clearCanvas()
    this.board = this.board.addPiece(i, j)
    this.drawBg()
    this.drawCells()
    let winner = this.board.winner()
    if (winner != null) {
      let text
      if (winner == Players.NONE) {
        text = 'DRAW'
      } else {
        let name = this.player[winner].name
        text = 'WINNER:\n' + name
      }
      setTimeout(() => {
        alert(text)
        $('#reset').show()
      }, 250)
    } else if (this.isAiRound()) {
      // TODO
      setTimeout(() => {
        const aiMove = this.ai.think(this.board)
        this.addPiece(aiMove.i, aiMove.j)
      }, 50)
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
