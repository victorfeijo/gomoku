import { Enum, Players } from './enum'

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

  miniMax() {
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
