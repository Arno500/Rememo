const path = require("path");
const { app, BrowserWindow, ipcMain } = require("electron");
const isDev = require("electron-is-dev");
const discordRPC = require("discord-rpc");

const clientId = "1038474817256562778";
console.log("loading");

let win;
let details = { title: "Main menu", deck: "undefined" };

function createWindow() {
  win = new BrowserWindow({
    icon: __dirname + "/favicon.ico",
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false,
    },
  });

  ipcMain.on("changeDeck", (event, newDetails) => {
    details = { ...newDetails };
  });

  win.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "index.html")}`
  );
  if (isDev) {
    win.webContents.openDevTools({ mode: "detach" });
  }
}

app.whenReady().then(() => {
  createWindow();
  console.log("created window");
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

const startTimestamp = Date.now();

const rpc = new discordRPC.Client({ transport: "ipc" });

async function setActivity() {
  if (!rpc || !win) {
    return;
  }
  let activity = {
    details: details.title,
    startTimestamp,
    largeImageKey: "rememo",
    largeImageText: "rememo",
    instance: false,
    state: null,
  } as any;
  if (details.deck !== "undefined") {
    activity.state = details.deck;
  }

  rpc.setActivity(activity);
}

rpc.on("ready", () => {
  setActivity();

  // activity can only be set every 15 seconds
  setInterval(() => {
    setActivity();
  }, 15e3);
});

rpc.login({ clientId }).catch(console.error);
