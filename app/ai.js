import { Enum, Players } from './enum'

class Ai {

  constructor(level) {
    this.level = level
  }

  think(board) {
    let i = Math.round(Math.random()*Enum.BOARD_ROWS_NUMBER)
    let j = Math.round(Math.random()*Enum.BOARD_COLUMNS_NUMBER)

    let time = new Date().getTime()
    let possibleBoards = this.possibilities(board)

    possibleBoards.forEach((board, key) => {
      if (this.evaluate(Players.ONE, board) > 0) {

        return {
          i: parseInt(key.slice(0, 2)),
          j: parseInt(key.slice(2, 4))
        }
      }
    })

    return {
      i: i,
      j: j,
    }
  }

  miniMax() {
  }

  middleBorderOrderedPossibilities(board) {
    let i = (Enum.BOARD_COLUMNS_NUMBER / 2) | 0
    let j = (Enum.BOARD_ROWS_NUMBER / 2) | 0
    let directions = [[0,1], [1,0], [0,-1], [-1,0]]
    let n = 0, distance = 1, direction = 0
    let keyArray = []
    while (n < Enum.BOARD_COLUMNS_NUMBER * Enum.BOARD_ROWS_NUMBER) {
      for(let k=0; k<distance; k++) {
        n ++
        // TODO inserir no mapa somente se não há jogador na casa
        keyArray[n] = [i, j]
        let step = directions[direction % 4]
        i += step[0]
        j += step[1]
      }
      direction++
      if (n > 0 && n%2 == 0) {
        distance++
      }
      
    }
    
    console.log(keyArray)
  }
  
  possibilities(board) {
    this.middleBorderOrderedPossibilities(board)
    let possibleBoards = new Map()
    board.forEach((playerId, i, j) => {
      if (playerId === Players.NONE) {
        let key = board.formatKey(i, j)
        let possibleBoard = board.addPiece(i, j)

        possibleBoards.set(key, possibleBoard)
      }
    })

    return possibleBoards
  }

  evaluate(maxPlayer, board) {
    // returns a grade to the player based on the current state
    let grade = 0, moves = 0
    let visitedCells = new Set()
    board.forEach((playerId, i, j) => {
      if (playerId !== Players.NONE && !visitedCells.has([i,j])) {
        let maxSet = board.getMaxSet(i, j)
        let freeSides = maxSet[1]
        maxSet = maxSet[0]
        if (maxSet.size >= 3) {
          let setGrade = Math.pow(maxSet.size, 5) * (freeSides + 0.1)
          if (maxSet.size >= 5) { setGrade *= 100 }
          if (playerId !== maxPlayer) { setGrade *= -1 }
          grade += setGrade
          maxSet.forEach((cell) => { visitedCells.add(cell) })
          moves += maxSet.size
        } else {
          moves++
        }
      }
    })
    if (board.winner() === maxPlayer) {
      grade -= 2 * moves
    } else if (board.winner() === board.switchPlayer(maxPlayer)) {
      grade += 2 * moves
    }
    return grade
  }
}

export default Ai
