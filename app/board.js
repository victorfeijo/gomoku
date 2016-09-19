import { Enum, Players } from './enum'

class Board {

  constructor(
    cells = null,
    player = Math.round(Math.random()),
    size = 0,
    lastX = 7,
    lastY = 7,
    sets = new Immutable.Map(),
    keyMap = new Immutable.Map()
  ) {
    // class constructor
    this.lastX = () => { return lastX }
    this.lastY = () => { return lastY }
    this.size = () => { return size }

    this.cells = cells
    if (cells == null) { this.cells = this.emptyCells() }
    let newSets = this.getNewSets()
    sets = this.updateSets(sets, keyMap, newSets)
    keyMap = sets.keyMap
    sets = sets.sets
    let winner = this.getWinner(newSets)
    if (winner != null) { player = Players.NONE }

    this.currentPlayer = () => { return player }
    this.winner = () => { return winner }
    this.sets = () => { return sets }
    this.keyMap = () => { return keyMap }
  }

  emptyCells() {
    let emptyMapObj = {}
    for (let i=0; i<Enum.BOARD_COLUMNS_NUMBER; i++)
    for (let j=0; j<Enum.BOARD_ROWS_NUMBER; j++) {
      let key = this.formatKey(i,j)
      emptyMapObj[key] = Players.NONE
    }
    return new Immutable.Map(emptyMapObj)
  }

  forEach(func) {
    // apply function for each element of this.cells
    for(let i=0; i<Enum.BOARD_ROWS_NUMBER; i++)
    for(let j=0; j<Enum.BOARD_COLUMNS_NUMBER; j++) {
      let key = this.formatKey(i, j)
      func(this.cells.get(key), i, j)
    }
  }

  updateSets(sets, keyMap, newSets) {
    let updatedKeys = new Set()
    newSets.opponentNeighbours.forEach((key) => {
      (keyMap.get(key) || []).forEach((id) => {
        sets = sets.delete(id)
      })
      keyMap = keyMap.delete(key)
      updatedKeys.add(key)
    })
    newSets.sets.forEach((set) => {
      set.set.forEach((key) => {
        (keyMap.get(key) || []).forEach((id) => {
          sets = sets.delete(id)
        })
        keyMap = keyMap.delete(key)
        updatedKeys.add(key)
      })
    })
    updatedKeys.forEach((key) => {
      let index = this.unformatKey(key)
      this.getNewSets(index[0], index[1]).sets.forEach((set) => {
        set.set.forEach((key) => {
          let keySet = keyMap.get(key) || new Immutable.Set()
          keyMap = keyMap.set(key, keySet.add(set.id))
        })
        sets = sets.set(set.id, set)
      })
    })

    return {
      sets: sets,
      keyMap: keyMap
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
      return new Board(newCells, newPlayer, newSize, x, y, this.sets(), this.keyMap())
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

  unformatKey(key) {
    return {
      i: parseInt(key.substring(1,3)),
      j: parseInt(key.substring(4,6))
    }
  }

  fixLength(num, length) {
    // transform number into a string with the determined length
    num = num.toString()
    while (num.length < length) {
      num = '0' + num
    }
    return '.' + num
  }

  getNewSets(iX = this.lastX(), iY = this.lastY(), cells = this.cells) {
    // returns an object containing (a set of objects containing a
    // (set of the same player and the number of adjacent free sides)
    // and the size of the bigest set)
    let ret = {
      opponentNeighbours: new Set(),
      sets: new Immutable.Set(),
      maxSize: 0,
    }
    let key = this.formatKey(iX, iY)
    const initialPlayerId = cells.get(key)
    if (initialPlayerId === Players.NONE) { return ret }
    const searchPaths = [[0, 1], [1, 0], [1, 1], [1, -1]]
    searchPaths.forEach(path => {
      let freeSides = 0
      let currentSet = new Immutable.Set()
      let id = ''
      let x = iX, y = iY
      for (let i = 0; i < 2; i++) {
        key = this.formatKey(x, y)
        while (cells.get(key) === initialPlayerId) {
          currentSet = currentSet.add(key)
          id += '.' + key
          x += path[0]
          y += path[1]
          key = this.formatKey(x, y)
        }
        if (cells.get(key) == Players.NONE) {
          freeSides ++
          key = this.formatKey(x+path[0], y+path[1])
          if (cells.get(key) === initialPlayerId) {
            freeSides++
          }
        } else if (cells.get(key) == this.switchPlayer(initialPlayerId)) {
          ret.opponentNeighbours.add(key)
        }
        if (i == 0) {
          path = path.map(n => { return n*-1 })
          x = iX + path[0]
          y = iY + path[1]
        }
      }
      if (currentSet.size > 1 || (ret.sets.size === 0 && path[0] === -1 && path[1] === 1)) {
        ret.sets = ret.sets.add({
          i: iX,
          j: iY,
          id: id,
          set: currentSet,
          freeSides: freeSides,
          player: initialPlayerId,
        })
      }
      if (currentSet.size > ret.maxSize) {
        ret.maxSize = currentSet.size
      }
    })
    return ret
  }

  getWinner(newSets) {
    // returns null or the id of the winner on the received conditions
    let winnerId = null
    const possibleWinnerId = this.get(this.lastX(), this.lastY())
    if (possibleWinnerId == Players.NONE) { return null }
    if (newSets.maxSize >= 5) {
      winnerId = possibleWinnerId
    } else if (this.size() === (Enum.BOARD_ROWS_NUMBER * Enum.BOARD_COLUMNS_NUMBER)) {
      winnerId = Players.NONE
    }
    return winnerId
  }

  hasPiecesNearby(iX, iY) {
    // return true if there are pieces on the received position or adjacencies
    let key = this.formatKey(iX, iY)
    if (this.cells.get(key) != Players.NONE) {
      return true
    }
    let pieceFound = false
    const searchPaths = [[0, 1], [1, 0], [1, 1], [1, -1]]
    searchPaths.forEach(path => {
      for (let i = 0; i < 2; i++) {
        let x = iX, y = iY
        x += path[0]
        y += path[1]
        key = this.formatKey(x, y)
        if (this.cells.get(key) != Players.NONE && this.cells.get(key) != null) {
          pieceFound = true
        }
        if (i == 0) {
          path = path.map(n => { return n*-1 })
          x = iX
          y = iY
        }
      }
    })
    return pieceFound
  }
}

export default Board
