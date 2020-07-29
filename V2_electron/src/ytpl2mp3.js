const fs = require("fs");
const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const remote = require('electron').remote;

var pathToFfmpeg = require('ffmpeg-static').replace('app.asar', 'app.asar.unpacked');
ffmpeg.setFfmpegPath(pathToFfmpeg);

//https://github.com/electron-userland/electron-installer-windows
//https://github.com/electron-react-boilerplate/electron-react-boilerplate

var path = process.env.HOME;
console.log(process.env)
document.getElementById("path_text").innerHTML = "Path : " + path;
var startTime;

function download(){
  startTime = Date.now();
  let  link = document.getElementById('playlist-id').value;
  ytpl.getPlaylistID(link, (err, playlistID)=>{
    if(err){
      if(ytdl.getVideoID(link))return download_track(link);
      else return document.getElementById('text-out').innerHTML =`/!\\ERREUR : Aucune vidéo trouvé/!\\ `;
    }

    ytpl(playlistID, { limit: Infinity } , function(err, playlist) {
      if(err) return document.getElementById('text-out').innerHTML =err.name + " : " + err.message + "<br>";
      document.getElementById('text-out').innerHTML ="Téléchargement de la playlist : " + playlist.title + "<br>";
      document.getElementById('text-out').innerHTML +="Nombre de piste audio à télécharger : " + playlist.total_items + "<br><br>";
      if (!fs.existsSync(path + '/' +playlist.title))fs.mkdirSync(path + "/"+ playlist.title);
      dl_track_from_playlist(playlist,0);
      });
  });
  }

const onProgress = (chunkLength, downloaded, total) => {
  const percent = downloaded / total;
  document.getElementById('avancement').innerHTML =`${(percent * 100).toFixed(2)}% downloaded (${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`;
};

function download_track(link){
  let stream = ytdl(link, {
    quality: 'highestaudio',
  });

  stream.on('progress', onProgress).on('info', (info)=>{

  document.getElementById('text-out').innerHTML +="Téléchargement de : " + info.videoDetails.title;
  let start = Date.now();
  
  var metadata = [
    `-metadata`,
    `title=${info.videoDetails.title}  `,
    `-metadata`,
    `artist=${info.videoDetails.author.name}  `,
  ];

  ffmpeg(stream)
    .audioBitrate(128)
    .outputOptions(metadata)
    .save(path.normalize(`${path}/${info.videoDetails.title}.mp3`))
    .on('error', function(err, stdout, stderr) {
      document.getElementById('text-out').innerHTML +=` | Erreur - ${err.message} <br>`;
    })
    .on('end', () => {
      document.getElementById('text-out').innerHTML +=`Musique téléchargée en ${(Date.now() - startTime) / 1000}s<br>`;
    });

  });
}

function dl_track_from_playlist(playlist,element)
{
  let stream = ytdl(playlist.items[element].url_simple, {
    quality: 'highestaudio',
  });
  
  stream.on('progress', onProgress);
  document.getElementById('text-out').innerHTML +="Téléchargement de : " + playlist.items[element].title;
  let start = Date.now();
  
  var metadata = [
    `-metadata`,
    `title=${playlist.items[element].title}  `,
    `-metadata`,
    `artist=${playlist.items[element].author.name}  `,
  ];

  ffmpeg(stream)
    .audioBitrate(128)
    .outputOptions(metadata)
    .save(`${path}/${playlist.title}/${playlist.items[element].title}.mp3`)
    .on('error', function(err, stdout, stderr) {
      document.getElementById('text-out').innerHTML +=` | Erreur - ${err.message} <br>`;
      if(element<(playlist.total_items-1))dl_track_from_playlist(playlist,++element);
      else   document.getElementById('text-out').innerHTML +=`Playlist téléchargée en ${(Date.now() - startTime) / 1000}s<br>`;
    })
    .on('end', () => {
      document.getElementById('text-out').innerHTML +=` | Done - ${(Date.now() - start) / 1000}s - ${element+1}/${playlist.total_items} <br>`;
      if(element<(playlist.total_items-1))dl_track_from_playlist(playlist,++element);
      else   document.getElementById('text-out').innerHTML +=`Playlist téléchargée en ${(Date.now() - startTime) / 1000}s<br>`;
    });
}

document.getElementById('app-close').onclick = function(event) {
  var window = remote.getCurrentWindow();
  window.close();
 };

function choose_path()
{
  var windows = remote.getCurrentWindow();
  var data = remote.dialog.showOpenDialogSync(windows, {
    properties: ['openDirectory']
  });
  if(data != undefined){path = data;document.getElementById("dl-button").disabled = false;}
  else{ document.getElementById("dl-button").disabled = true;}
  document.getElementById("path_text").innerHTML = "Path : " + path;
}