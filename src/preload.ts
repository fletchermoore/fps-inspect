"use strict";
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
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
        //fileSelectedSubject: fileSelectedSubject,

        onSetImage: (cb:any) => {
            ipcRenderer.on('set-image', (event: any, path: string) => {
                cb(path);
            })
        },

        on: (channel: string, cb: any) => {
            ipcRenderer.on(channel, (event: any, data: any) => {
                cb(data);
            })
        }
    }
)


