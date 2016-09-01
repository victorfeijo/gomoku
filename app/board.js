import { Enum } from './enum'
import { Players } from './enum'

class Board {

  constructor(cells, player, size) {
    if (cells == null){
      let _emptyMapObj = {}
      for (let i=0; i<Enum.BOARD_COLUMNS_NUMBER; i++)
      for (let j=0; j<Enum.BOARD_ROWS_NUMBER; j++) {
        let key = this.formatKey(i,j)
        _emptyMapObj[key] = Players.NONE
      }
      this.cells = new Immutable.Map(_emptyMapObj)
    } else {
      this.cells = cells
    }

    let _currentPlayer = player
    if (player == null) {
      _currentPlayer = Math.round(Math.random())
    }
    this.currentPlayer = () => { return _currentPlayer }

    let _size = size
    if (size == null) {
      _size = 0
    }
    this.size = () => { return _size }
  }

  forEach(func) {
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++)
    for(let j=0; j<Enum.BOARD_COLUMNS_NUMBER; j++) {
      let key = this.formatKey(i, j)
      func(this.cells.get(key), i, j)
    }
  }

  switchPlayer(player) {
    switch (player) {
      case Players.ONE:
        player = Players.TWO
        break
      case Players.TWO:
        player = Players.ONE
        break
      default:
        player = Math.round(Math.random())
    }
    return player
  }

  addPiece(x, y) {
    let key = this.formatKey(x, y)
    if (this.cells.get(key) == Players.NONE) {
      let player = this.currentPlayer()
      let newCells = this.cells.set(key, player)
      let newPlayer = this.switchPlayer(player)
      let newSize = this.size()+1
      return new Board(newCells, newPlayer, newSize)
    } else {
      return this
    }
  }

  get(i, j, func) {
    let key = this.formatKey(i, j)
    func(this.cells.get(key))
  }

  formatKey(x, y) {
    let len = Enum.KEY_LENGTH / 2
    return this.fixLength(x, len) + this.fixLength(y, len)
  }

  fixLength(num, length) {
    num = num.toString()
    while (num.length < length) {
      num = '0' + num
    }
    return '.' + num
  }

  getWinner(lastX, lastY) {
    // TODO
    // SEARCH ADJACENT PIECES
    // if (piece at (lastX, lastY) is in a line of five of the same player)
    //   ṛeturn player from (lastX, lastY)
    if (this.size() == (Enum.BOARD_ROWS_NUMBER * Enum.BOARD_COLUMNS_NUMBER)) {
      return Players.NONE
    } else {
      return null
    }
  }
}

export default Board
