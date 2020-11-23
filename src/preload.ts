"use strict";
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
//var dialog = require('electron').remote.dialog;
const { contextBridge, ipcRenderer } = require('electron');

interface Window {
    app: any
}

contextBridge.exposeInMainWorld(
    'app',
    {
        selectFile: () => {
            ipcRenderer.send('select-file');
        },

        selectImage: () => {
            ipcRenderer.send('select-image');
        },

        onFileSelected: (cb:any) => {
            ipcRenderer.on('file-selected', (event: any, path: string) => {
                cb(path);
            });
        },

        onSetImage: (cb:any) => {
            ipcRenderer.on('set-image', (event: any, path: string) => {
                cb(path);
            })
        }
    }
)


