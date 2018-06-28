const read = require('tesseractocr')

const imagePath = `${__dirname}/text.jpg`

console.log(imagePath)

read(imagePath, (err, text) => {
  if (err)
    throw err
  else
    console.log('OUTPUT: ', text)
})