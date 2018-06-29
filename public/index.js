const fs = require('fs')
const video = document.querySelector('#camera-stream')
const image = document.querySelector('#snap')
const controls = document.querySelector('.controls')
const take_photo_btn = document.querySelector('#take-photo')
const canvas = document.querySelector('#canvas')
let imageCapture

navigator.getMedia =
  navigator.mediaDevices.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia ||
  navigator.msGetUserMedia

if (!navigator.getMedia) {
  displayErrorMessage("Your browser doesn't have support for the navigator.getUserMedia interface.")
} else {
  navigator.getUserMedia(
    {
      video: true
    },
    function(stream) {
      const videoTrack = stream.getVideoTracks()[0]
      imageCapture = new ImageCapture(videoTrack)
    },
    function(err) {
      console.error(err)
      // displayErrorMessage('There was an error with accessing the camera stream: ' + err.name, err)
    }
  )
}

take_photo_btn.addEventListener('click', function(e) {
  imageCapture
    .takePhoto()
    .then(blob => {
      fs.writeFileSync('picture.png', Buffer.from(new Uint8Array(blob)))
      return createImageBitmap(blob)
    })
    .then(imageBitmap => {
      drawCanvas(canvas, imageBitmap)
    })
})

const drawCanvas = (canvas, img) => {
  console.log(canvas)
  canvas.width = getComputedStyle(canvas).width.split(`px`)[0]
  canvas.height = getComputedStyle(canvas).height.split(`px`)[0]
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height)
  let x = (canvas.width - img.width * ratio) / 2
  let y = (canvas.height - img.height * ratio) / 2
  canvas.getContext(`2d`).clearRect(0, 0, canvas.width, canvas.height)
  canvas.getContext(`2d`).drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio)
}
