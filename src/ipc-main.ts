
const { ipcMain, dialog } = require('electron');
const { Extractor } = require('./extractor');
const { Tesseract } = require('./tesseract');
const path = require('path');





ipcMain.on('select-file', function(event : any) {
    var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
    if (paths)
    {
        event.sender.send('file-selected',paths[0]);
        let extractor = new Extractor(paths[0]);
        extractor.extract().then(() => {
            console.log(" it worked. now to load an image i guess");
        }).catch((error: any) => {
            console.log("reporting error from ipcmain");
            console.log(error);
        });
    }
});


ipcMain.on('select-image', function(event: any) {
    var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
    if (paths)
    {
        let ext = path.extname(paths[0]);
        if (ext == '.jpg')
        {
            event.sender.send('set-image', paths[0]);
            let tesseract = new Tesseract(paths[0]);
            tesseract.preprocess();
            tesseract.interpret().catch((error: any) => {
                console.log('tess process error', error);
            });
        }
    }
});