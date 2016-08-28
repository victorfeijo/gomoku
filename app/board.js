import { Enum } from './enum'

class Board {

  constructor() {
    this.board = new Array(Enum.BOARD_ROWS_NUMBER)
    this.cleanBoard()
  }

  cleanBoard() {
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++) {
      this.board[i] = new Array(Enum.BOARD_COLUMNS_NUMBER)
    }
  }

  forEach(func) {
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++) {
      for(let j=0; i<Enum.BOARD_ROWS_NUMBER; i++) {
        func(this.board[i][j], i, j, this.board)
      }
    }
  }

  set(func) {
    func(this.board)
  }

  get(row, column, func) {
    func(this.board, this.board[row][column])
  }
}

export default Board
