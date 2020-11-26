// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

import { BehaviorSubject } from 'rxjs';

const fileSelected = new BehaviorSubject('');
const statusUpdated = new BehaviorSubject('');

const removeChildren = (parent: any) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};

window.app.on('file-selected', (fileName: string) => {
    fileSelected.next(fileName);
});

window.app.on('status-updated', (status: string) => {
    statusUpdated.next(status);
});

window.app.on('image-set', (path: string) => {
    var viewer = document.getElementById('viewer');
    if (viewer) {
        let img = new Image();
        img.onload = () => {
            removeChildren(viewer);
            viewer?.appendChild(img);
        }
        img.src = path;
    }
})

statusUpdated.subscribe((status: string) => {
    let statusLabel = document.getElementById('statusLabel');
    if (statusLabel) {
        statusLabel.innerText = status;
    }
});

fileSelected.subscribe((fileName: string) => {
    var selectedFileLabel = document.getElementById('selectedFileLabel');
    if (selectedFileLabel) {
        selectedFileLabel.innerHTML = fileName;
    }
});



document.getElementById('selectFileButton')?.addEventListener('click', () => {
   window.app.selectFile();      
});

document.getElementById('loadButton')?.addEventListener('click', () => {
    window.app.selectImage();
});