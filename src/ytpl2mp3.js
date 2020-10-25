const fs = require('fs');
const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const { remote } = require('electron');
const path = require('path');
const itunesAPI = require("node-itunes-search");


var pathToFfmpeg = require('ffmpeg-static').replace(
  'app.asar',
  'app.asar.unpacked',
)

ffmpeg.setFfmpegPath(pathToFfmpeg)

var startTime;
var taille;
var chemin;
var format;

window.onload = () => {
  let setting = JSON.parse(fs.readFileSync(__dirname + '/userSetting.json'))

  chemin = setting.path || process.env.HOME || process.env.USERPROFILE
  document.getElementById('path_text').value = chemin

  if (setting.welcomeMsg) {
    document.getElementById('s3').checked = true
    document.getElementById('page').classList.add('active')
  } else {
		document.getElementById('s3').checked = false
  }

  if (setting.debug){
    document.getElementById('checkDebug').checked = true
    //document.querySelector('.is-debug').classList.add('block')
    document.getElementById('debug-window').classList.add('block')
  } else document.getElementById('checkDebug').checked = false

  document.getElementById(setting.format).checked = true;
}

function download() {
  startTime = Date.now()
  let link = document.getElementById('playlist-id').value
  format = document.querySelector('input[name="radio"]:checked').id;

  ytpl.getPlaylistID(link).then((playlistID) => {

    ytpl(playlistID, { limit: Infinity }).then((playlist)=> {
      document.getElementById('text-out').innerHTML ='Téléchargement de la playlist : ' + playlist.title + '<br>'
      document.getElementById('text-out').innerHTML +='Nombre de piste audio à télécharger : ' + playlist.total_items + '<br><br>'
      if (!fs.existsSync(chemin + '/' + playlist.title))
        fs.mkdirSync(chemin + '/' + playlist.title)
      dl_track_from_playlist(playlist, 0)
    }).catch(err => {
      return afficher_err(err.name, err.message);
    });
  }).catch(err => {
    try {
      if (ytdl.getVideoID(link)) return download_track(link)
    } catch (error) {
      return afficher_err('Wrong link', "Aucun fichier disponible au téléchargement")
    }
  });
}

const onProgress = (chunkLength, downloaded, total) => {
  taille = (total / 1024 / 1024).toFixed(2)
  const percent = downloaded / total
  //const bar = document.getElementById('myBar')
  const bartxt = document.getElementById('progressText')
  //bar.style.width = (percent * 100).toFixed(2) + '%'
  bartxt.innerHTML = (percent * 100).toFixed(2) + '%'
  if ((percent * 100).toFixed(2) == 100) {
    bartxt.innerHTML = 'Téléchargement terminé !'
  }
}

function download_track(link) {
  let stream = ytdl(link, { quality: 'highestaudio' })
  stream.on('progress', onProgress)
  stream.on('info', (info) => {
  //document.getElementById('progressBar').classList.add('visible')
  document.getElementById('text-out').innerHTML +="Téléchargement de : " + info.videoDetails.title;
  let start = Date.now()
    
  const searchOptions = {
    term: `${info.videoDetails.title}`,
    limit: 1
  };
    
  itunesAPI.searchItunes(searchOptions).then((result) => {

    var metadata;
    if(result.resultCount == 0)
    {
      metadata = [
        `-metadata`,
        `title=${info.videoDetails.title}  `,
        `-metadata`,
        `artist=${info.videoDetails.author.name}  `,
      ];
    }
    else
    {
      metadata = [
        `-metadata`,
        `title=${result.results[0].trackName}  `,
        `-metadata`,
        `artist=${result.results[0].artistName}  `,
        `-metadata`,
        `album=${result.results[0].collectionName}  `,
        `-metadata`,
        `date=${result.results[0].releaseDate}  `,
        `-metadata`,
        `genre=${result.results[0].kind}  `,
      ];
    }

    var fichier_out = `${chemin}/${info.videoDetails.title.replace(/\//g,'-')}.${format}`;
    if(process.platform == 'win32') fichier_out =`${chemin}/${info.videoDetails.title.replace(/\//g,'-').replace(/[\<\>\:\«\|\?\*\.]*/g,'')}.${format}`;

    ffmpeg(stream)
      .audioBitrate(128)
      .outputOptions(metadata)
      .save(fichier_out)
      .on('error', function (err, stdout, stderr) {
        afficher_err(info.videoDetails.title, err)
      })
      .on('end', () => {
        afficher_notif(info.videoDetails.title, taille + 'MB')
      });
    });
  });
}

function dl_track_from_playlist(playlist, element) {
  let stream = ytdl(playlist.items[element].url_simple, {quality: 'highest'})

  stream.on('progress', onProgress)
  //document.getElementById('progressBar').classList.add('visible')
  document.getElementById('text-out').innerHTML +="Téléchargement de : " + playlist.items[element].title;
  let start = Date.now()

  const searchOptions = {
    term: `${playlist.items[element].title}`,
    limit: 1
  };

  itunesAPI.searchItunes(searchOptions).then((result) => {

    var metadata;
    if(result.resultCount == 0)
    {
      metadata = [
        `-metadata`,
        `title=${playlist.items[element].title}  `,
        `-metadata`,
        `artist=${playlist.items[element].author.name}  `,
      ];
    }
    else
    {
      metadata = [
        `-metadata`,
        `title=${result.results[0].trackName}  `,
        `-metadata`,
        `artist=${result.results[0].artistName}  `,
        `-metadata`,
        `album=${result.results[0].collectionName}  `,
        `-metadata`,
        `date=${result.results[0].releaseDate}  `,
        `-metadata`,
        `genre=${result.results[0].kind}  `,
      ];
    }

    var fichier_out = `${chemin}/${playlist.title}/${playlist.items[element].title.replace(/\//g,'-')}.${format}`;
    if(process.platform == 'win32') fichier_out = `${chemin}/${playlist.title}/${playlist.items[element].title.replace(/\//g,'-').replace(/[\<\>\:\«\|\?\*\.]*/g,'')}.${format}`;
    
    ffmpeg(stream)
      .audioBitrate(128)
      .outputOptions(metadata)
      .save(fichier_out)
      .on('error', function (err, stdout, stderr) {
        afficher_err(playlist.items[element].title, err)
        if (element < playlist.total_items - 1)
          dl_track_from_playlist(playlist, ++element)
        else
          document.getElementById('text-out').innerHTML += `Playlist téléchargée en ${(Date.now() - startTime) / 1000}s<br>`
      })
      .on('end', () => {
        afficher_notif(playlist.items[element].title, taille + ' MB')
        if (element < playlist.total_items - 1)
          dl_track_from_playlist(playlist, ++element)
        else
          document.getElementById('text-out',).innerHTML += `Playlist téléchargée en ${(Date.now() - startTime) / 1000}s<br>`
      });
  });
}

function choose_path() {
  var windows = remote.getCurrentWindow()
  var data = remote.dialog.showOpenDialogSync(windows, {properties: ['openDirectory']})
  if (data != undefined) chemin = data
  document.getElementById('path_text').value = chemin
}

function afficher_err(text, err) {
  document.getElementById('errp').textContent = text
  document.getElementById('errs').textContent = err
  //showErr()
}

function afficher_notif(text1, text2) {
  document.getElementById('notifp').textContent = text1
  document.getElementById('notifs').textContent = text2
  //showPop()
}

function save_param() {
  let setting = {
    format: document.querySelector('input[name="radio"]:checked').id,
    path: document.getElementById('path_text').value,
    welcomeMsg: document.getElementById('s3').checked,
    debug: document.getElementById('checkDebug').checked,
  }

  fs.writeFileSync(__dirname + '/userSetting.json', JSON.stringify(setting))
}
