// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

import { BehaviorSubject } from 'rxjs';

const fileSelectedSubject = new BehaviorSubject('');

window.app.on('file-selected', (fileName: string) => {
    fileSelectedSubject.next(fileName);
});

interface Window {
    app: any
}

const removeChildren = (parent: any) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

fileSelectedSubject.subscribe((fileName: string) => {
    var selectedFileLabel = document.getElementById('selectedFileLabel');
    if (selectedFileLabel) {
        selectedFileLabel.innerHTML = fileName;
    }
});

window.app.on('status-updated', (status: string) => {
    let statusLabel = document.getElementById('statusLabel');
    if (statusLabel)
    {
        statusLabel.innerText = status;
    }
})

window.app.onSetImage((path:string) => {
    var viewer = document.getElementById('viewer');
    if (viewer)
    {
        let img = new Image();
        img.onload = () => {
            removeChildren(viewer);
            viewer?.appendChild(img);
        }
        img.src = path;
    }
})

document.getElementById('selectFileButton')?.addEventListener('click', () => {
    window.app.selectFile();       
});

document.getElementById('loadButton')?.addEventListener('click', () => {
    window.app.selectImage();
});