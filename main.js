const electron = require('electron');
// Module to control application life.
const app = electron.app;
const {
 dialog,
 webContents
} = require('electron');
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

const path = require('path');
const fs = require('fs');
const url = require('url');
const ms = require('mustache');

const {
 ipcMain
} = require('electron');
const settings = require('electron-settings');

global.globalObject = {
 "arguments": process.argv,
};

let debugMode = false;

if (arguments[0] == "debug") {
 debugMode = true;
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let impWindows = {};
let windowState = {};
let viewerFakeLocalized = "";

function saveTemplates() {
 mustacheOptions = {
  "dirname": __dirname,
  "usrPath": app.getPath('userData'),
  "appPath": app.getAppPath(),
  "jsPath": path.resolve(app.getAppPath(), "./js"),
  "consolePath": JSON.stringify(path.resolve(app.getAppPath(), "./js/console-script.js")),
 }
 fs.readFile(path.resolve(__dirname, './templates/console.tpl'), 'utf8', (err, data) => {
  ms.escapeHtml = function(text) {
   return text;
  }
  if (err) throw err;
  let tplConsole = data;
  let consoleLocalized = ms.render(tplConsole, mustacheOptions);
  fs.writeFile(path.resolve(app.getPath('userData'), './console.html'), consoleLocalized, (err) => {
   if (err) throw err;
   createWindow();

  });
 });

}

try {
 windowState = settings.get('windowstate', {
  "main": {
   "bounds": {
    "x": 0,
    "y": 0,
    "width": 800,
    "height": 600
   },
   "isMaximized": false
  }
 });
}
catch (err) {
 // the file is there, but corrupt. Handle appropriately.
}

function storeWindowState() {
 windowState.main.isMaximized = impWindows.main.isMaximized();
  if (!windowState.main.isMaximized) {
  // only update bounds if the window isn't currently maximized
  windowState.main.bounds = impWindows.main.getBounds();
 }
 settings.set('windowstate', windowState);
};

// main process

function createWindow() {
 // Create the browser window.
 impWindows.main = new BrowserWindow({
  x: windowState.main.bounds && windowState.main.bounds.x || undefined,
  y: windowState.main.bounds && windowState.main.bounds.y || undefined,
  width: windowState.main.bounds && windowState.main.bounds.width || 800,
  height: windowState.main.bounds && windowState.main.bounds.height || 600,
  icon: path.resolve(__dirname, 'img/icon.png'),
  title: 'impressPlayer Console',
  show: false,
  backgroundColor: '#13132A'
 });

 if (windowState.main.isMaximized) {
  impWindows.main.maximize();
 }

 // and load the index.html of the app.
 impWindows.main.loadURL(url.format({
  pathname: path.resolve(app.getPath('userData'), './console.html'),
  protocol: 'file:',
  slashes: true
 }));

 impWindows.main.on('ready-to-show', function() {
  impWindows.main.show();
  impWindows.main.focus();
 });

 impWindows.main.webContents.on('did-frame-finish-load', function() {
  //impWindows.main.webContents.executeJavaScript(require(path.resolve(app.getAppPath(), "./js/console-script.js")));
 });

 impWindows.main.on('close', event => {
  storeWindowState();
  event.preventDefault(); //this prevents it from closing. The `closed` event will not fire now
  impWindows.main.webContents.send('quitModal');

  ipcMain.on('reallyQuit', (event) => {
   app.exit();
  });
 });
 // Emitted when the window is closed.
 impWindows.main.on('closed', function() {
  // Dereference the window object, usually you would store windows
  // in an array if your app supports multi windows, this is the time
  // when you should delete the corresponding element.
  impWindows.main = null;
 });
 impWindows.main.on('resize', function() {
  storeWindowState();
 });
 impWindows.main.on('move', function() {
  storeWindowState();
 });
 if (debugMode) {
  impWindows.main.webContents.openDevTools()
 }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', saveTemplates);
//app.on('ready', );

// Quit when all windows are closed.
app.on('window-all-closed', function() {
 // On OS X it is common for applications and their menu bar
 // to stay active until the user quits explicitly with Cmd + Q
 if (process.platform !== 'darwin') {
  app.quit();
 }
});



app.on('activate', function() {
 // On OS X it's common to re-create a window in the app when the
 // dock icon is clicked and there are no other windows open.
 if (impWindows.main === null) {
  createWindow();
 }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.

/* Impress Player scripts */

// Logs generating

function currentDate() {
 var today = new Date();
 var dd = today.getDate();
 var mm = today.getMonth() + 1; //January is 0!
 var yyyy = today.getFullYear();

 if (dd < 10) {
  dd = '0' + dd;
 }

 if (mm < 10) {
  mm = '0' + mm;
 }

 today = yyyy + '-' + mm + '-' + dd;
 return today;
}

function createLog(text) {
 var file = fs.openSync(app.gatPath('userData') + "log-" + currentDate() + ".log", 'a');
 fs.writeFile(file, text, function(err) {
  if (err) {
   return console.log(err);
  }
  console.log("The log was saved!");
 });
}

/* Event listeners and IPC listeners */

ipcMain.on('saveLogs', (event, text) => {
 createLog(text);
});
