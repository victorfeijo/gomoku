import { Enum } from './enum'
import { Players } from './players'

class Board {

  constructor() {
    this.cells = new Array(Enum.BOARD_ROWS_NUMBER)
    this.cleanBoard()
    this.currentPlayer = Players.NONE
  }


  cleanBoard() {
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++) {
      this.cells[i] = new Array(Enum.BOARD_COLUMNS_NUMBER)
      for(let j=0; j<Enum.BOARD_COLUMNS_NUMBER; j++) {
        this.cells[i][j] = Players.NONE
      }
    }
  }

  forEach(func) {
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++) {
      for(let j=0; j<Enum.BOARD_COLUMNS_NUMBER; j++) {
        func(this.cells[i][j], i, j)
      }
    }
  }

  set(row, column, player) {
    this.cells[row][column] = player;
    // TODO checkWin()
    this.switchPlayer()
  }

  switchPlayer() {
    switch (this.currentPlayer) {
      case Players.ONE:
        this.currentPlayer = Players.TWO
        break
      case Players.TWO:
        this.currentPlayer = Players.ONE
        break
      default:
        this.currentPlayer = Math.round(Math.random())
    }
  }

  get(row, column, func) {
    func(this.cells[row][column])
  }
}

export default Board
