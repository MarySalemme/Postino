const fs = require('fs')
const path = require('path')
const express = require('express')
const multer = require("multer")

const port = process.env.PORT || 3000

const upload = multer({
  dest: "./uploads"
})

const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
}

const server = express()

server.set('view engine', 'ejs')

server.get('/', (req, res) => {
  res.render('index')
})

server.post('/read', upload.single("file"), (req, res) => {
  const tempPath = req.file.path
  const targetPath = path.join(__dirname, "./uploads/image.png")

  fs.rename(tempPath, targetPath, err => {
    if (err) return handleError(err, res)

    res
      .status(200)
      .contentType("text/plain")
      .end("File uploaded!")
  })

  res.redirect('/')
})

server.listen(port, () => {
  console.log(`Running on ${port}`)
})