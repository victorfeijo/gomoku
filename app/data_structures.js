class Stack extends Array {

  constructor() {
    super()
  }

  push(value, callback) {
    super.push(value)

    if (callback) { callback(value, this) }
  }

  pop(callback) {
    let value = super.pop()

    if (callback) { callback(value, this) }
  }
}

class Queue extends Array {

  constructor() {
    super()
  }

  push(value, callback) {
    super.unshift(value)

    if (callback) { callback(value, this) }
  }

  pop(callback) {
    let value = super.shift()

    if (callback) { callback(value, this) }
  }
}

export default { Stack, Queue }
