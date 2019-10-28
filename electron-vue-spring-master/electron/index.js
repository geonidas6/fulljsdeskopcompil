const electron = require('electron');
const path = require('path');
const url = require('url');
var findPort = require("find-free-port");
const isDev = require('electron-is-dev');
const logger = require('./logger');

const { shell, app, BrowserWindow, dialog } = electron;





// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

// The server process
const JAR = 'spring-0.0.1-SNAPSHOT.jar'; // how to avoid manual update of this?
const MAX_CHECK_COUNT = 10;
let serverProcess;


//lance le server
function startServer(port) {
// Run mysql_start
/*if (shell.openItem('mysql_start.bat') !== 0) {
  //dialog.showErrorBox('Error',`Mysql failed.`);
}*/


//lancer mysql
serverProcess = require('child_process')
    .exec('C:/xampp/mysql/bin/mysqld --defaults-file=C:/xampp/mysql/bin/my.ini --standalone')


//----------------
var mysql = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : null, // or the original password : 'apaswword'
});

// connect to mysql
connection.connect(function(err) {
  // in case of error
  if(err){
      console.log(err.code);
      console.log(err.fatal);
  }
});

// Perform a query
$query = 'CREATE DATABASE IF NOT EXISTS electronangular';

connection.query($query, function(err, rows, fields) {
    if(err){
        console.log("An error ocurred performing the query.");
        console.log(err);
        return;
    }

    console.log("Query succesfully executed", rows);
});


// Close the connection
connection.end(function(){
    // The connection has been closed
});
//----------------












  const platform = process.platform;

  const server = `${path.join(app.getAppPath(), '..', '..', JAR)}`;
  logger.info(`Launching server with jar ${server} at port ${port}...`);

  serverProcess = require('child_process')
    .spawn('java', [ '-jar', server, `--server.port=4200`]);
	

  serverProcess.stdout.on('data', logger.server);

  if (serverProcess.pid) {
    logger.info("Server PID: " + serverProcess.pid);
  } else {
	 /* dialog.showErrorBox('Error',
              `ServerProcess not pid.`);*/
    logger.error("Failed to launch server process.")
  }
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false
    }
  })

  // and load the splash screen of the app
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'splash.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  });
}

function loadHomePage(baseUrl) {
  logger.info(`Loading home page at ${baseUrl}`);
  // check server health and switch to main page
  checkCount = 0;
  const axios = require('axios');
  setTimeout(function cycle() {
    //axios.get(`${baseUrl}`) mode vujs
    axios.get(`${baseUrl}`)
      .then(response => {
        mainWindow.loadURL(`${baseUrl}`);
      })
      .catch(e => {
        if (e.code === 'ECONNREFUSED') {
          if (checkCount < MAX_CHECK_COUNT) {
            checkCount++;
            setTimeout(cycle, 1000);
          } else {
            //dialog.showErrorBox('Server timeout',`UI does not receive server response for ${MAX_CHECK_COUNT} seconds.`);
            //app.quit()
          }
        } else {
          logger.error(e)
          dialog.showErrorBox('Server error', 'UI receives an error from server.');
          app.quit()
        }
      });
  }, 200);
}

// Cette méthode sera appelée quand Electron aura fini
// initialisation et est prêt à créer des fenêtres de navigateur.
// Certaines API ne peuvent être utilisées qu'après cet événement.
app.on('ready', function () {
  logger.info('###################################################')
  logger.info('#                Application Start                #')
  logger.info('###################################################')
  // Create window first to show splash before starting server
  createWindow();

  if (isDev) {
    // Assume the webpack dev server is up at port 9000  
    loadHomePage('http://localhost:4200');
  } else {
//------debut add angular
//enmode dev pour lancer le serveur ng serve --open port 4200

    findPort(4200, function(err, port) {
      logger.info(`Starting server at port ${port}`)
	 
      startServer(4200);
      loadHomePage(`http://localhost:4200`)
    });
  }
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  serverProcess = require('child_process')
    .exec('C:/xampp/mysql/bin/mysqld --defaults-file=C:/xampp/mysql/bin/my.ini --standalone')
  if (process.platform !== 'darwin') {
    app.quit()
  }
});

app.on('activate', function () {
// Sur OS X, il est courant de recréer une fenêtre dans l'application lorsque le
   // L'icône du dock est cliquée et aucune autre fenêtre n'est ouverte.
  if (mainWindow === null) {
    createWindow()
  }
});

app.on('will-quit', () => {
  if (serverProcess) {
    logger.info(`Killing server process ${serverProcess.pid}`);
    const kill = require('tree-kill');
    kill(serverProcess.pid, 'SIGTERM', function (err) {
      logger.info('Server process killed');
        serverProcess = null;
    });
  }
});
// Dans ce fichier, vous pouvez inclure le reste du processus principal spécifique de votre 
//application.
// code. Vous pouvez également les mettre dans des fichiers séparés et les demander ici.