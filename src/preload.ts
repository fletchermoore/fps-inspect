"use strict";
// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// my own custom NODE_MODULES are not allowed due to sandbox

const { contextBridge, ipcRenderer } = require('electron');

interface Window {
    app: any
}

// allowing any channel to be used is not safe because
// ipcRenderer can send to some electron native channels
const channelWhiteList = [
    'file-selected',
    'status-updated',
    'image-set'
]

contextBridge.exposeInMainWorld(
    'app',
    {
        selectFile: () => {
            ipcRenderer.send('select-file');
        },

        selectImage: () => {
            ipcRenderer.send('select-image');
        },

        on: (channel: string, cb: any) => {
            if (channelWhiteList.includes(channel)) {
                ipcRenderer.on(channel, (event: any, data: any) => {
                    cb(data);
                })
            }
            else
            {
                console.log("invalid channel: " + channel);
            }
        }
    }
)


