const take_photo_btn = document.querySelector('#take-photo')
const canvas = document.querySelector('#canvas')
const video = document.querySelector('#video')
let imageCapture

navigator.mediaDevices.getUserMedia(
  {
    video: true
  }).then(stream => {
    video.srcObject = stream
    const videoTrack = stream.getVideoTracks()[0]
    console.log('I GET HERE')
    imageCapture = new ImageCapture(videoTrack)
  }).catch(function (err) {
    console.error(err)
  })

take_photo_btn.addEventListener('click', function (e) {
  imageCapture
    .takePhoto()
    .then(blob => {
      const formData = new FormData();
      formData.append('photo', blob)

      fetch('http://localhost:3000/read', {
        method: 'POST',
        body: formData
      }).catch(err => console.log(err))

    })
})
