class Foo {
  constructor(some) {
    this.some = some
  }

  log() {
    console.log(this.some)
  }

  alert() {
    alert(this.some)
  }
}

let foo = new Foo('Foo')
document.getElementById('log').addEventListener('click', foo.log.bind(foo))

$('#alert').click(() => {
  alert('jquery is working')
})

