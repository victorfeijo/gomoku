import { Enum, Players } from './enum'

class Board {

  constructor(cells, player, size, winner = null) {
    // class constructor
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
    // apply function for each element of this.cells
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++)
    for(let j=0; j<Enum.BOARD_COLUMNS_NUMBER; j++) {
      let key = this.formatKey(i, j)
      func(this.cells.get(key), i, j)
    }
  }

  switchPlayer(player) {
    // receives a player id and returns the next player id
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
    // returns the new board after adding a piece on the position received
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

  get(i, j) {
    // aply function on the received position
    let key = this.formatKey(i, j)
    return this.cells.get(key)
  }

  formatKey(x, y) {
    // transform (x,y) position to an unique identifier key
    let len = Enum.KEY_LENGTH / 2
    return this.fixLength(x, len) + this.fixLength(y, len)
  }

  fixLength(num, length) {
    // transform number into a string with the determined length
    num = num.toString()
    while (num.length < length) {
      num = '0' + num
    }
    return '.' + num
  }

  getMaxSet(iX, iY, cells = this.cells) {
    // return an array containing the biggest set of the same player
    // and the number of adjacent free sides
    let maxSet = [new Set(), 0]
    let key = this.formatKey(iX, iY)
    const initialPlayerId = cells.get(key)
    const searchPaths = [[0, 1], [1, 0], [1, 1], [1, -1]]
    searchPaths.forEach(path => {
      let freeSides = 0
      let currentSet = new Set()
      let x = iX, y = iY
      for (let i = 0; i < 2; i++) {
        key = this.formatKey(x, y)
        while (cells.get(key) === initialPlayerId) {
          currentSet.add([x, y])
          x += path[0]
          y += path[1]
          key = this.formatKey(x, y)
        }
        if (cells.get(key) == Players.NONE) {
          freeSides ++
        }
        if (i == 0) {
          path = path.map(n => { return n*-1 })
          x = iX + path[0]
          y = iY + path[1]
        }
      }
      if (currentSet.size > maxSet[0].size) {
        maxSet = [currentSet, freeSides]
      }
    })
    return maxSet
  }

  getWinner(lastX, lastY, cells, boardSize) {
    // returns null or the id of the winner on the received conditions
    let winnerId = null
    const key = this.formatKey(lastX, lastY)
    const possibleWinnerId = cells.get(key)
    if (this.getMaxSet(lastX, lastY, cells)[0].size >= 5) {
      winnerId = possibleWinnerId
    } else if (boardSize == (Enum.BOARD_ROWS_NUMBER * Enum.BOARD_COLUMNS_NUMBER)) {
      winnerId = Players.NONE
    }
    return winnerId
  }

  isFirstPlay(player) {
    let visitedCells = 0

    this.forEach((playerId, i, j) => {
      if (playerId === player) { visitedCells++ }
    })

    return visitedCells === 0
  }
}

export default Board
