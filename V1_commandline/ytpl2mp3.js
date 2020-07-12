const fs = require("fs");
const readline = require('readline');
const ytpl = require('ytpl');
const ytdl = require('ytdl-core');
const ffmpeg = require('fluent-ffmpeg');

const startTime = Date.now();
const link = process.argv[2];

if(link==undefined)return process.stdout.write("/!\\Le programme prend en argument le lien de la playlist/!\\\n");

if(ytpl.validateURL(link)){
    ytpl(link, { limit: Infinity } , function (err, playlist) {
        if(err) return process.stdout.write(err.name + " : " + err.message + "\n");
        readline.cursorTo(process.stdout, 0);
        process.stdout.write("Téléchargement de la playlist : " + playlist.title + "\n");
        process.stdout.write("Nombre de piste audio à télécharger : " + playlist.total_items + "\n\n");
        if (!fs.existsSync(playlist.title))fs.mkdirSync(playlist.title);
        dl_track(playlist,0);
      });
}else{
  process.stdout.write("Erreur lien non valide\n");
}

const onProgress = (chunkLength, downloaded, total) => {
  const percent = downloaded / total;
  readline.cursorTo(process.stdout, 0);
  process.stdout.write(`${(percent * 100).toFixed(2)}% downloaded `);
  process.stdout.write(`(${(downloaded / 1024 / 1024).toFixed(2)}MB of ${(total / 1024 / 1024).toFixed(2)}MB)`);
};

function dl_track(playlist,element)
{
  let stream = ytdl(playlist.items[element].url_simple, {
    quality: 'highestaudio',
  });
  
  stream.on('error', console.error).on('progress', onProgress);
  process.stdout.write("Téléchargement de : " + playlist.items[element].title + "\n");
  let start = Date.now();
  
  ffmpeg(stream)
    .audioBitrate(128)
    .save(`${__dirname}/${playlist.title}/${playlist.items[element].title}.mp3`)
    .on('end', () => {
      process.stdout.write(`\ndone - ${(Date.now() - start) / 1000}s - ${element+1}/${playlist.total_items}\n\n`);
      if(element<(playlist.total_items-1))dl_track(playlist,++element);
      else   process.stdout.write(`Playlist téléchargée en ${(Date.now() - startTime) / 1000}s\n`);
    });
}