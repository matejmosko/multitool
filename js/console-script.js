  let multitoolConsole = (function() {
   const remote = require('electron').remote;
   const app = remote.app;
   const path = require('path');
   const url = require('url');
   const fs = require('fs');
   const ms = require('mustache');
   const DecompressZip = require('decompress-zip');
   const {
    dialog
   } = require('electron').remote;
   const settings = remote.require('electron-settings');

   const arguments = remote.getGlobal('globalObject').arguments;

   const ipc = require('electron').ipcRenderer;
   let opts = {},
    running = false,
    exitDialog = document.getElementById("exitDialog"),
    debugMode = false;
   setupSettings();

   if (arguments[0] == "debug") {
    debugMode = true;
   }

   // Setup Settings Database

   function setupSettings() {
    if (!settings.has("name")) {
     ipc.send('saveDefaultSettings');
    }
    loadSettings(settings.getAll());
   }

   function loadSettings(p) {
    opts = p;
   }

   /* Logs */

   function saveLogs(text) {
    console.log(text);
    ipc.send('saveLogs', text);
   }

   function loadFile(loadedFile) { // load file
    file = fs.openSync(loadedFile[0], 'a');
    fs.readFile(loadedFile[0]);
   }

   /* UI part - all buttons tabs, radios etc. */

   document.getElementById("selectSubtitles").addEventListener("click", function() {
    dialog.showOpenDialog({
     filters: [
      {
       name: 'impress.js presentations',
       extensions: ['md', 'mkd', 'markdown', 'html', 'htm', 'txt']
      },
      {
       name: 'All Files',
       extensions: ['*']
      }
      ]
    }, function(fileNames) {
     if (fileNames === undefined) {
      console.log("No file selected");
      return;
     }
     generateOdp(fileNames[0]);
    });
   });

   /* Functions */

   function generateOdp(file) {
    fs.readFile(file, 'utf-8', (err, data) => {
     if (err) {
      alert("An error ocurred reading the file :" + err.message);
      return;
     }
     let lines = data.split("\n");

     var template = fs.readFileSync("templates/content.tpl", "utf-8");

     let rendered = ms.render(template, {
      "slide": lines
     });

     fs.writeFile("templates/content.xml", rendered, function(err) {
      if (err) {
       return console.log(err);
      }
      console.log("The file was saved!");
     });

    });
   }

   /* Exit dialog */

   ipc.on('quitModal', (event) => { // Show "Really Quit" dialog
    exitDialog.opened = true;
   });

   document.getElementById("reallyQuit").addEventListener("click", function() { // "Really Quit"  confirmed. We are leaving the ship.
    ipc.send('reallyQuit');
   });

   document.getElementById("doNotQuit").addEventListener("click", function() { // "Really Quit" refused. The show must go on...
    exitDialog.opened = false;
   });


  })();
