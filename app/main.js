import { Enum } from './enum'

class Gomoku {

  constructor(playerName) {
    this.playerName = playerName
    this.whoStart = Math.round(Math.random())
  }

  setup() {
    // create board, pieces, set initial state to game, etc
  }

  start() {
    // main loop game
  }

  reset() {
    // reset game
  }
}

$('#alert').click(() => {
  alert(Enum.BOARD_ROWS_NUMBER)
})

