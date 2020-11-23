// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.


const removeChilds = (parent: any) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};


window.app.onFileSelected((path:string) => {
    var selectedFileLabel = document.getElementById('selectedFileLabel');
    if (selectedFileLabel)
    {
        selectedFileLabel.innerHTML = path;
    }
});

window.app.onSetImage((path:string) => {
    var viewer = document.getElementById('viewer');
    if (viewer)
    {
        let img = new Image();
        img.onload = () => {
            removeChilds(viewer);
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