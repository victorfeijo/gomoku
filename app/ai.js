import { Enum, Players } from './enum'

class Ai {

  constructor(level) {
    this.level = level
  }

  think(board) {

    // if (board.isFirstPlay(Players.TWO)) { return this.firstMove(board) }

    let time = new Date().getTime()
    let move = this.miniMax(2, board, board.switchPlayer(board.currentPlayer()), -Infinity, +Infinity)
    console.log('MiniMax took ' + ((new Date().getTime() - time)/1000) + 's.')
    console.log(move.score)
    console.log(move.index)
    return {
      i: move.index[0],
      j: move.index[1],
    }

  }

  miniMax(depth, board, maxPlayer, alpha, beta) {
    let bestPosition = [-1, -1]
    let score

    if (depth == 0 || board.winner() != null) {
      score = this.evaluate(maxPlayer, board)
      return {
        score: score,
        index: bestPosition
      }
    } else {
      let possibleIndex = this.orderedPossibilities(board)
      if (possibleIndex.length == 0) {
        score = this.evaluate(maxPlayer, board)
        return {
          score: score,
          index: bestPosition
        }
      }
      for (let i=0; i < possibleIndex.length; i++) {
        let index = possibleIndex[i]
        let newBoard = board.addPiece(index[0], index[1])
        if (board.currentPlayer() == maxPlayer) {
          score = this.miniMax(depth-1, newBoard, maxPlayer, alpha, beta).score
          if (score > alpha) {
            alpha = score
            bestPosition = index
          } else if (score === alpha) {
            const randomBit = Math.round(Math.random())
            if (randomBit) { bestPosition = index }
          }
        } else {
          score = this.miniMax(depth-1, newBoard, maxPlayer, alpha, beta).score
          if (score < beta) {
            beta = score
            bestPosition = index
          } else if (score === beta) {
            const randomBit = Math.round(Math.random())
            if (randomBit) { bestPosition = index }
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
    let i = board.lastX()
    let j = board.lastY()
    let directions = [[1,0], [0,-1], [-1,0], [0,1]]
    let n = 0, distance = 1, direction = 0, outerInteration = 0
    let highPriority = [], lowPriority = []
    while (n < Enum.BOARD_COLUMNS_NUMBER * Enum.BOARD_ROWS_NUMBER) {
      for(let k=0; k<distance; k++) {
        if (
          i >= 0 && i < Enum.BOARD_COLUMNS_NUMBER &&
          j >= 0 && j < Enum.BOARD_ROWS_NUMBER
        ) {
          n ++
        }
        const isPossible = board.get(i,j) == Players.NONE
        if (isPossible) {
          if (board.hasPiecesNearby(i,j)) {
            highPriority.push([i, j])
          } else {
            lowPriority.push([i, j])
          }
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
    return highPriority.concat(lowPriority)
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
          if (maxSet.size === 4 && freeSides > 1) { setGrade *= 1e8 }
          if (maxSet.size >= 5) { setGrade *= 1e30 }
          setGrade += 10 - (Math.abs(i-7)) - (Math.abs(j-7))
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
      grade -= 1e7 * moves
    } else if (board.winner() === board.switchPlayer(maxPlayer)) {
      grade += 1e7 * moves
    }
    return grade
  }
}

export default Ai
