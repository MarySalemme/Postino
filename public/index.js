const take_photo_btn = document.querySelector('#take-photo')
const video = document.querySelector('#video')
let imageCapture

navigator.mediaDevices.getUserMedia(
  {
    video: true
  }).then(stream => {
    video.srcObject = stream
    const videoTrack = stream.getVideoTracks()[0]
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
      
      console.log('Sending photo...')
      fetch('/read', {
        method: 'POST',
        body: formData,
      }).then(res => {
        console.log('Sent successfully')
        location.href = res.url;
      }).catch(err => console.log('fetch error', err))
    }).catch(err => console.log('error', err))
})
