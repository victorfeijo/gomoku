import { Enum, Players } from './enum'

class Board {

  constructor(cells, player, size, winner) {
    this.cells = cells
    if (cells == null){
      let emptyMapObj = {}
      for (let i=0; i<Enum.BOARD_COLUMNS_NUMBER; i++)
      for (let j=0; j<Enum.BOARD_ROWS_NUMBER; j++) {
        let key = this.formatKey(i,j)
        emptyMapObj[key] = Players.NONE
      }
      this.cells = new Immutable.Map(emptyMapObj)
    }

    if (player == null) { player = Math.round(Math.random()) }
    if (winner != null) { player = Players.NONE }
    this.currentPlayer = () => { return player }

    size = size || 0
    this.size = () => { return size }

    this.winner = () => { return winner }
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
    if (this.cells.get(key) == Players.NONE && this.winner() == null) {
      let player = this.currentPlayer()
      let newCells = this.cells.set(key, player)
      let newPlayer = this.switchPlayer(player)
      let newSize = this.size()+1
      let winner = this.getWinner(x, y, newCells, newSize)
      return new Board(newCells, newPlayer, newSize, winner)
    }
    return this
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

  getWinner(lastX, lastY, cells, size) {
    let winnerId = null
    let key = this.formatKey(lastX, lastY)
    let possibleWinnerId = cells.get(key)
    let searchPaths = [[0, 1], [1, 0], [1, 1], [1, -1]]
    searchPaths.forEach(path => {
      let count = 0
      let x = lastX, y = lastY
      for (let i = 0; i < 2; i++) {
        key = this.formatKey(x, y)
        while (cells.get(key) == possibleWinnerId) {
          count ++
          x += path[0]
          y += path[1]
          key = this.formatKey(x, y)
        }
        if (i == 0) {
          path = path.map(n => { return n*-1 })
          x = lastX + path[0]
          y = lastY + path[1]
        }
      }
      if (count >= 5) {
        winnerId = possibleWinnerId
      }
    })
    if (winnerId == null) {
      if (size == (Enum.BOARD_ROWS_NUMBER * Enum.BOARD_COLUMNS_NUMBER)) {
        winnerId = Players.NONE
      }
    }
    return winnerId
  }
}

export default Board
