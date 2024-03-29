const { app, BrowserWindow } = require("electron");
// const { autoUpdater } = require("electron-updater");
const path = require("path");
const Store = require("electron-store");

Store.initRenderer();

const windowUrl = app.isPackaged
  ? `file://${path.join(__dirname, "../build/index.html")}`
  : `http://localhost:3000`;

let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });
  mainWindow.loadURL(windowUrl);
  mainWindow.on(`closed`, () => (mainWindow = null));

  // mainWindow.once("ready-to-show", () => {
  //   autoUpdater.checkForUpdatesAndNotify();
  // });
}

app.on(`ready`, createWindow);

app.on(`window-all-closed`, () => {
  if (process.platform !== `darwin`) {
    app.quit();
  }
});

app.on(`activate`, () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// autoUpdater.on("update-available", () => {
//   mainWindow.webContents.send("update_available");
// });

// autoUpdater.on("update-downloaded", () => {
//   mainWindow.webContents.send("update_downloaded");
// });
