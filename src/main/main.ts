"use strict";
// Modules to control application life and create native browser window
var _a = require('electron'), app = _a.app, BrowserWindow = _a.BrowserWindow;
import { protocol } from "electron";
var path = require('path');
const { Controller } = require('./controller');

const isDev = process.env.NODE_ENV === "development";

let controller = new Controller();

function createWindow() {
    // Create the browser window.
    var mainWindow = new BrowserWindow({
        width: 1600,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            enableRemoteModule: false,
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: !isDev
        }
    });
    if (isDev) {
        // hot reloading and other goodness
        console.log("dev is happening!");
        mainWindow.loadURL("http://localhost:8080");
        mainWindow.webContents.openDevTools();
    }
    else {
        console.log('dev didnt h appen....');
        mainWindow.loadFile('dist/renderer/index.html');
    }
    
    // Open the DevTools.
    
    controller.setWindow(mainWindow);
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(function () {
    if (isDev)
    {
        // this is necessary so we can load local files when index.html does not
        // come from the local disk, but rather http://localhost because I am using
        // webpack dev-server
        protocol.registerFileProtocol('file', (request, callback) => {
            const pathname = decodeURI(request.url.replace('file:///', ''));
            callback(pathname);
        });
    }
    createWindow();
    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0)
            createWindow();
    });
});
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
    if (process.platform !== 'darwin')
        app.quit();
});



