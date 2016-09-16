import { Enum, Players } from './enum'

class Ai {

  constructor(level) {
    this.level = level
  }

  think(board) {

    if (board.isFirstPlay(Players.TWO)) { return this.firstMove(board) }

    let move = this.miniMax(2, board, Players.TWO, -Infinity, +Infinity)
    console.log(move.score)
    console.log(move.index)
    return {
      i: move.index[0],
      j: move.index[1],
    }
  }

  miniMax(depth, board, maxPlayer, alpha, beta) {
    let possibleIndex = this.orderedPossibilities(board)
    let bestPosition = [-1, -1]
    let score

    if (possibleIndex.length == 0 || depth == 0 || board.winner() != null) {
      score = this.evaluate(maxPlayer, board)
      return {
        score: score,
        index: bestPosition
      }
    } else {
      for (let i=0; i < possibleIndex.length; i++) {
        let index = possibleIndex[i]
        let newBoard = board.addPiece(index[0], index[1])
        if (board.currentPlayer() == maxPlayer) {
          score = this.miniMax(depth-1, newBoard, maxPlayer, alpha, beta).score
          if (score > alpha) {
            alpha = score
            bestPosition = index
          }
        } else {
          score = this.miniMax(depth-1, newBoard, maxPlayer, alpha, beta).score
          if (score < beta) {
            beta = score
            bestPosition = index
          }
        }
        if (alpha > beta) {
          break
        }
      }
      return {
        score: (board.currentPlayer() == maxPlayer) ? alpha : beta,
        index: bestPosition
      }
    }
  }

  orderedPossibilities(board) {
    let i = ((Enum.BOARD_COLUMNS_NUMBER / 2) | 0) - 1
    let j = (Enum.BOARD_ROWS_NUMBER / 2) | 0
    let directions = [[1,0], [0,-1], [-1,0], [0,1]]
    let n = 0, index = 0, distance = 1, direction = 0, outerInteration = 0
    let keyArray = []
    while (n < Enum.BOARD_COLUMNS_NUMBER * Enum.BOARD_ROWS_NUMBER) {
      for(let k=0; k<distance; k++) {
        n ++
        const isPossible = board.get(i,j) == Players.NONE
        if (isPossible) {
          keyArray[index++] = [i, j]
        }
        let step = directions[direction % 4]
        i += step[0]
        j += step[1]
      }
      direction++
      if (outerInteration > 0 && outerInteration%2 == 0) {
        distance++
      }
      outerInteration++
    }
    return keyArray
  }

  possibilities(board) {
    return this.orderedPossibilities(board)
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
        if (maxSet.size >= 1) {
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

  firstMove(board) {
    let player = board.get(7, 7)
    if (player === Players.NONE) {
      return {
        i: 7,
        j: 7
      }
    } else {
      return {
        i: 7,
        j: 8
      }
    }
  }
}

export default Ai
