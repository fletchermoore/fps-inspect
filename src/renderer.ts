// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.



document.getElementById('selectFileButton')?.addEventListener('click', () => {
    
    var paths : [string] | undefined = window.selectFile();
    
    if (paths)
    {
        var viewer = document.getElementById('viewer');
        if (viewer)
        {
            viewer.innerHTML = paths[0];
        }
    }
    else
    {
        // user canceled
    }
});