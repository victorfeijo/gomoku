import Board from './board'
import { Players, Enum } from './enum'

class Ai {

  constructor(level) {
    this.level = level
  }

  think(board) {
    let i = Math.round(Math.random()*Enum.BOARD_ROWS_NUMBER)
    let j = Math.round(Math.random()*Enum.BOARD_COLUMNS_NUMBER)

    return {
      i: i,
      j: j,
    }
  }

  avaliate(board) {
    let player1 = 0
    let player2 = 0

    board.forEach((value, i, j) => {
      if (value === Players.ONE ) {
        player1 ++
      }
      if (value === Players.TWO ) {
        player2 ++
      }
    })

    console.log(`player1: ${player1} player2: ${player2}`)
  }
}

export default Ai
