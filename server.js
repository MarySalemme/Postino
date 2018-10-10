const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require("multer")
const read = require('tesseractocr')

const say = require('say')


const port = process.env.PORT || 3000

let textOutput

const upload = multer({
  dest: "./uploads"
})

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!")
}

const server = express()

server.use(express.urlencoded({ extended: true }))
server.set('view engine', 'ejs')
server.use(express.static('public'))

server.get('/', (req, res) => {
  res.render('index', { output: textOutput })
})


let type = upload.single('photo')


server.post('/read', type, (req, res) => {
  console.log('Recieved photo')
  const tempPath = req.file.path
  const targetPath = path.join(__dirname, "./uploads/image.png")

  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res)

    read(targetPath, (err, text) => {
      if (err) {
        throw err
      }
      else {
        textOutput = text.trim()
        console.log(textOutput)
        say.speak(textOutput)
        res.redirect('/')
      }
    })
  })
})

server.post('/confirm', (req, res) => {
  console.log(req.body)
  res.sendStatus(200)
})

server.listen(port, () => {
  console.log(`Running on ${port}`)
})
