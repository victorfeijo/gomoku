import express from 'express'
import path from 'path'
import bodyParser from 'body-parser'
import methodOverride from 'method-override'

const app = express()
const publicDir = __dirname + '/public'
const port = process.env.PORT || 3000

function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500)
  res.render('error', { error: err })
}

app.get('/', (req, res) => {
  res.sendFile(path.join(publicDir, '/index.html'))
})

app.use(bodyParser())
app.use(methodOverride())
app.use(errorHandler)
app.use(express.static(__dirname + '/public'))

app.listen(port, () => {
  console.log('Listening on port ' + port)
})
