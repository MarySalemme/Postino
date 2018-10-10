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
    function (stream) {
      const videoTrack = stream.getVideoTracks()[0]
      imageCapture = new ImageCapture(videoTrack)
    },
    function (err) {
      console.error(err)
    }
  )
}

take_photo_btn.addEventListener('click', function (e) {
  imageCapture
    .takePhoto()
    .then(blob => {
      const formData = new FormData();
      formData.append('photo', blob)
      console.log('hashfshdf')

      fetch('http://localhost:3000/read', {
        method: 'POST',
        body: formData,
      }).then(res => {
        location.href = res.url;
      }).catch(err => console.log(err))

    })
})

const drawCanvas = (canvas, img) => {
  canvas.width = getComputedStyle(canvas).width.split(`px`)[0]
  canvas.height = getComputedStyle(canvas).height.split(`px`)[0]
  let ratio = Math.min(canvas.width / img.width, canvas.height / img.height)
  let x = (canvas.width - img.width * ratio) / 2
  let y = (canvas.height - img.height * ratio) / 2
  canvas.getContext(`2d`).clearRect(0, 0, canvas.width, canvas.height)
  canvas.getContext(`2d`).drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio)
}
