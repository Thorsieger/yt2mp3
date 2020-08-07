# udownload

**Udownload** est un projet de logiciel de téléchargement de vidéo youtube. Personnellement je ne trouvais pas un outils en ligne pour télécharger facilement la totalité des bandes sonores de grosse playlist (>>100). Le but est de disposer d'une version graphique propre et simple d'utilisation.

Ce projet se base sur electronjs et electron-builder pour créer l'app. Les dépendences ytdl-core, ytpl et ffmpeg permettent d'obtenir les fichiers demandées par l'utilisateur.
### Installation et Test
Pré-requis : Node.js
- Copier les fichiers du repository
- npm install
- npm start
### Build
Pré-requis : yarn, linux (commande rm/cp)
Il est possible de packager l'app vers les linux, osx et windows :
- yarn package-linux 
- yarn package-win
- yarn package-mac

License
----

MIT



