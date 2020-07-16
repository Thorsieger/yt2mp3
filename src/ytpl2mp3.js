const fs = require("fs");
const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');
const remote = require('electron').remote;

var path = undefined;

function download(){
  const startTime = Date.now();
  const link = document.getElementById('playlist-id').value;

  if(link==undefined)return document.getElementById('text-out').textContent +="/!\\Le programme prend en argument le lien de la playlist/!\\\n";

  if(ytpl.validateURL(link)){
    ytpl(link, { limit: Infinity } , function(err, playlist) {
      console.log(playlist,err);
        if(err) return document.getElementById('text-out').textContent +=err.name + " : " + err.message + "\n";
        document.getElementById('text-out').textContent +="Téléchargement de la playlist : " + playlist.title + "\n";
        document.getElementById('text-out').textContent +="Nombre de piste audio à télécharger : " + playlist.total_items + "\n\n";
        if (!fs.existsSync(path + '/' +playlist.title))fs.mkdirSync(path + "/"+ playlist.title);
        dl_track(playlist,0);
      });
  }else{
    document.getElementById('text-out').textContent +="Erreur lien non valide\n";
  }
  }

const onProgress = (chunkLength, downloaded, total) => {
  const percent = downloaded / total;
  document.getElementById('text-out').textContent +=`${(percent * 100).toFixed(2)}% downloaded `;
  document.getElementById('text-out').textContent +=`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`;
};

function dl_track(playlist,element)
{
  let stream = ytdl(playlist.items[element].url_simple, {
    quality: 'highestaudio',
  });
  
  //stream.on('error', console.error).on('progress', onProgress);
  document.getElementById('text-out').textContent +="Téléchargement de : " + playlist.items[element].title + "\n";
  let start = Date.now();
  
  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${path}/${playlist.title}/${playlist.items[element].title}.mp3`)
    .on('end', () => {
      document.getElementById('text-out').textContent +=`\ndone - ${(Date.now() - start) / 1000}s - ${element+1}/${playlist.total_items}\n\n`;
      if(element<(playlist.total_items-1))dl_track(playlist,++element);
      else   document.getElementById('text-out').textContent +=`Playlist téléchargée en ${(Date.now() - startTime) / 1000}s\n`;
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

