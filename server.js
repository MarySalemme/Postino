const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require("multer")
const read = require('tesseractocr')
const mongoose = require('mongoose')

const say = require('say')

const fuzzySearch = require('./searcher')
const emailer = require('./emailClient')


const port = process.env.PORT || 3000

let result

const upload = multer({
  dest: "./uploads"
})

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!")
}

const mongoDB = 'mongodb://localhost:27017/test'
mongoose.connect(mongoDB)
mongoose.Promise = global.Promise;
const db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))
db.once('open', function () {
  console.log('connected!')
})

const Email = mongoose.model('email',
  new mongoose.Schema({ name: String, email: String, id: Number }), 'emails')

const server = express()

server.use(express.urlencoded({ extended: true }))
server.set('view engine', 'ejs')
server.use(express.static('public'))

server.get('/', (req, res) => {
  res.render('index', { output: result })
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
        const textOutput = text.trim()
        console.log('Text output >>>>>>>>>>>>>>>>>>>>>>>>>>', textOutput)

        Email.find({}, (err, emailList) => { 
          result = fuzzySearch(emailList, textOutput)
          say.speak(textOutput)
          res.redirect('/')
        })
      }
    })
  })
})

server.post('/confirm', (req, res) => {
  emailer(req.body['user-input'])
  res.render('confirmation', { output: req.body['user-input'] })
})

server.listen(port, () => {
  console.log(`Running on ${port}`)
})
