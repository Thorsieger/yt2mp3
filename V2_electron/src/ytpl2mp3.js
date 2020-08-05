const fs = require('fs')
const ytpl = require('ytpl')
const ytdl = require('ytdl-core')
const ffmpeg = require('fluent-ffmpeg')
const { remote } = require('electron')
const path = require('path')

var pathToFfmpeg = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked',
)
ffmpeg.setFfmpegPath(pathToFfmpeg)

var chemin = process.env.HOME || process.env.USERPROFILE
document.getElementById('path_text').value = chemin
var startTime

function download() {
  startTime = Date.now()
  let link = document.getElementById('playlist-id').value
  ytpl.getPlaylistID(link, (err, playlistID) => {
    if (err) {
      if (ytdl.getVideoID(link)) return download_track(link)
      else
        return (document.getElementById(
          'text-out',
        ).innerHTML = `/!\\ERREUR : Aucune vidéo trouvé/!\\ `)
    }

    ytpl(playlistID, { limit: Infinity }, function (err, playlist) {
      if (err)
        return (document.getElementById('text-out').innerHTML =
          err.name + ' : ' + err.message + '<br>')
      document.getElementById('text-out').innerHTML =
        'Téléchargement de la playlist : ' + playlist.title + '<br>'
      document.getElementById('text-out').innerHTML +=
        'Nombre de piste audio à télécharger : ' +
        playlist.total_items +
        '<br><br>'
      if (!fs.existsSync(chemin + '/' + playlist.title))
        fs.mkdirSync(chemin + '/' + playlist.title)
      dl_track_from_playlist(playlist, 0)
    })
  })
}

const onProgress = (chunkLength, downloaded, total) => {
  const percent = downloaded / total
  const bar = document.getElementById('myBar')
  const bartxt = document.getElementById('progressText')
  bar.style.width = (percent * 100).toFixed(2) + '%'
  bartxt.innerHTML = (percent * 100).toFixed(2) + '%'
  if ((percent * 100).toFixed(2) == 100) {
    bartxt.innerHTML = 'Téléchargement terminé !'
    document.querySelector('.confetti-wrapper').classList.add('congrats')
  }
}

function download_track(link) {
  let stream = ytdl(link, {
    quality: 'highestaudio',
  })

  stream.on('progress', onProgress).on('info', (info) => {
    document.getElementById('progressBar').classList.add('visible')
    //document.getElementById('text-out').innerHTML +="Téléchargement de : " + info.videoDetails.title;
    let start = Date.now()

    var metadata = [
      `-metadata`,
      `title=${info.videoDetails.title}  `,
      `-metadata`,
      `artist=${info.videoDetails.author.name}  `,
    ]

    ffmpeg(stream)
      .audioBitrate(128)
      .outputOptions(metadata)
      .save(path.normalize(`${chemin}/${info.videoDetails.title}.mp3`))
      .on('error', function (err, stdout, stderr) {
        //document.getElementById('text-out').innerHTML +=` | Erreur - ${err.message} <br>`;
      })
      .on('end', () => {
        //document.getElementById('text-out').innerHTML +=`Musique téléchargée en ${(Date.now() - startTime) / 1000}s<br>`;
      })
  })
}

function dl_track_from_playlist(playlist, element) {
  let stream = ytdl(playlist.items[element].url_simple, {
    quality: 'highestaudio',
  })

  stream.on('progress', onProgress)
  document.getElementById('progressBar').classList.add('visible')
  //document.getElementById('text-out').innerHTML +="Téléchargement de : " + playlist.items[element].title;
  let start = Date.now()

  var metadata = [
    `-metadata`,
    `title=${playlist.items[element].title}  `,
    `-metadata`,
    `artist=${playlist.items[element].author.name}  `,
  ]

  ffmpeg(stream)
    .audioBitrate(128)
    .outputOptions(metadata)
    .save(`${chemin}/${playlist.title}/${playlist.items[element].title}.mp3`)
    .on('error', function (err, stdout, stderr) {
      //document.getElementById('text-out').innerHTML +=` | Erreur - ${err.message} <br>`;
      if (element < playlist.total_items - 1)
        dl_track_from_playlist(playlist, ++element)
      else
        document.getElementById(
          'text-out',
        ).innerHTML += `Playlist téléchargée en ${
          (Date.now() - startTime) / 1000
        }s<br>`
    })
    .on('end', () => {
      //document.getElementById('text-out').innerHTML +=` | Done - ${(Date.now() - start) / 1000}s - ${element+1}/${playlist.total_items} <br>`;
      if (element < playlist.total_items - 1)
        dl_track_from_playlist(playlist, ++element)
      else
        document.getElementById(
          'text-out',
        ).innerHTML += `Playlist téléchargée en ${
          (Date.now() - startTime) / 1000
        }s<br>`
    })
}

document.getElementById('close-button').onclick = function (event) {
  var window = remote.getCurrentWindow()
  window.close()
}

function choose_path() {
  var windows = remote.getCurrentWindow()
  var data = remote.dialog.showOpenDialogSync(windows, {
    properties: ['openDirectory'],
  })
  if (data != undefined) {
    chemin = data
    document.getElementById('dl-button').disabled = false
  } else {
    document.getElementById('dl-button').disabled = true
  }
  document.getElementById('path_text').innerHTML = 'Path : ' + chemin
}

//Renderer
document.getElementById('window-title').innerHTML = document.title

document.getElementById('min-button').addEventListener('click', function () {
  remote.getCurrentWindow().minimize()
})

// document.getElementById('close-intro').addEventListener('click', function () {
//   document.getElementById('intro').remove()
// })

// Debug
// Tabs
;('use strict')

function Tabs() {
  var bindAll = function () {
    var menuElements = document.querySelectorAll('[data-tab]')
    for (var i = 0; i < menuElements.length; i++) {
      menuElements[i].addEventListener('click', change, false)
      // console.log(menuElements[i])
    }
  }

  var clear = function () {
    var menuElements = document.querySelectorAll('[data-tab]')
    for (var i = 0; i < menuElements.length; i++) {
      menuElements[i].classList.remove('active')
      var id = menuElements[i].getAttribute('data-tab')
      document.getElementById(id).classList.remove('active')
    }
  }

  var change = function (e) {
    clear()
    e.target.classList.add('active')
    e.target.parentNode.classList.toggle('active')
    var id = e.currentTarget.getAttribute('data-tab')
    document.getElementById(id).classList.add('active')
  }

  bindAll()
}

var connectTabs = new Tabs()

document.getElementById('checkDebug').addEventListener('click', function () {
  var text = document.getElementById('debugText')
  if (document.getElementById('checkDebug').checked == true) {
    text.classList.add('block')
  } else {
    text.classList.remove('block')
  }
})

// slide
window.addEventListener('load', () => new Cards())
class Cards {
  constructor() {
    this.cards = Array.from(document.querySelectorAll('.notif'))

    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.update = this.update.bind(this)
    this.targetBCR = null
    this.target = null
    this.startX = 0
    this.currentX = 0
    this.screenX = 0
    this.targetX = 0
    this.draggingCard = false

    this.addEventListeners()

    requestAnimationFrame(this.update)
  }

  addEventListeners() {
    document.addEventListener('touchstart', this.onStart)
    document.addEventListener('touchmove', this.onMove)
    document.addEventListener('touchend', this.onEnd)

    document.addEventListener('mousedown', this.onStart)
    document.addEventListener('mousemove', this.onMove)
    document.addEventListener('mouseup', this.onEnd)
  }

  onStart(evt) {
    if (this.target) return

    if (!evt.target.classList.contains('notif')) return

    this.target = evt.target
    this.targetBCR = this.target.getBoundingClientRect()

    this.startX = evt.pageX || evt.touches[0].pageX
    this.currentX = this.startX

    this.draggingCard = true
    this.target.style.willChange = 'transform'

    evt.preventDefault()
  }

  onMove(evt) {
    if (!this.target) return

    this.currentX = evt.pageX || evt.touches[0].pageX
  }

  onEnd(evt) {
    if (!this.target) return

    this.targetX = 0
    let screenX = this.currentX - this.startX
    if (Math.abs(screenX) > this.targetBCR.width * 0.25) {
      this.targetX = screenX > 0 ? this.targetBCR.width : -this.targetBCR.width
    }

    this.draggingCard = false
  }

  update() {
    requestAnimationFrame(this.update)

    if (!this.target) return

    if (this.draggingCard) {
      this.screenX = this.currentX - this.startX
    } else {
      this.screenX += (this.targetX - this.screenX) / 4
    }

    const normalizedDragDistance = Math.abs(this.screenX) / this.targetBCR.width
    const opacity = 1 - Math.pow(normalizedDragDistance, 3)

    this.target.style.transform = `translateX(${this.screenX}px)`
    this.target.style.opacity = opacity

    // User has finished dragging.
    if (this.draggingCard) return

    const isNearlyAtStart = Math.abs(this.screenX) < 0.1
    const isNearlyInvisible = opacity < 0.01

    // If the card is nearly gone.
    if (isNearlyInvisible) {
      // Bail if there's no target or it's not attached to a parent anymore.
      if (!this.target || !this.target.parentNode) return

      this.target.parentNode.removeChild(this.target)

      const targetIndex = this.cards.indexOf(this.target)
      this.cards.splice(targetIndex, 1)

      // Slide all the other cards.
      this.animateOtherCardsIntoPosition(targetIndex)
    } else if (isNearlyAtStart) {
      this.resetTarget()
    }
  }

  animateOtherCardsIntoPosition(startIndex) {
    // If removed card was the last one, there is nothing to animate. Remove target.
    if (startIndex === this.cards.length) {
      this.resetTarget()
      return
    }

    const frames = [
      {
        transform: `translateY(${this.targetBCR.height + 20}px)`,
      },
      {
        transform: 'none',
      },
    ]
    const options = {
      easing: 'cubic-bezier(0,0,0.31,1)',
      duration: 150,
    }
    const onAnimationComplete = () => this.resetTarget()

    for (let i = startIndex; i < this.cards.length; i++) {
      const card = this.cards[i]

      // Move the card down then slide it up.
      card
        .animate(frames, options)
        .addEventListener('finish', onAnimationComplete)
    }
  }

  resetTarget() {
    if (!this.target) return

    this.target.style.willChange = 'initial'
    this.target.style.transform = 'none'
    this.target = null
  }
}

// confetti
