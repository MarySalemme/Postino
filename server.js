const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require("multer")
const read = require('tesseractocr')

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

server.set('view engine', 'ejs')

server.get('/', (req, res) => {
  res.render('index', { output: textOutput })
})

server.post('/read', upload.single("file"), (req, res) => {
  const tempPath = req.file.path
  const targetPath = path.join(__dirname, "./uploads/image.png")

  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res)

    read(targetPath, (err, text) => {
      if (err) {
        throw err
      }
      else {
        textOutput = text
        res.redirect('/')
      }
    })
  })
})

server.listen(port, () => {
  console.log(`Running on ${port}`)
})