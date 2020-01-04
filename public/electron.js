const { app, BrowserWindow, ipcMain, Notification } = require("electron");

const path = require("path");
const isDev = require("electron-is-dev");

const notifier = require('node-notifier');
const RPC = require('discord-rpc');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, 
    height: 680, 
    title: "Timer", 
    icon: path.join(__dirname, 'icon.ico'),
    autoHideMenuBar: true,
    webPreferences: { 
      nodeIntegration: true 
    }
  });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Discord RPC
const clientId = "663069616775495683";
RPC.register(clientId);

const rpc = new RPC.Client({transport: 'ipc'});
const startTimestamp = new Date();

rpc.on('ready', () => {
  console.log("rpc ready");
  rpc.setActivity({
    details: 'Timing themselves',
    startTimestamp,
    largeImageKey: 'timer-icon',
    largeImageText: 'Timer',
    instance: false
  });
});

rpc.login({clientId}).catch(console.error);

// IPCs
ipcMain.on("paused", (event, arg) => {
  notifier.notify({
    title: "Timer",
    message: "Your timer has been paused.",
    icon: path.join(__dirname, 'icon.ico'),
    appID: 'Timer'
  });
});
ipcMain.on("resumed", (event, arg) => {
  notifier.notify({
    title: "Timer",
    message: "Your timer has been resumed.",
    icon: path.join(__dirname, 'icon.ico'),
    appID: 'Timer'
  });
});
