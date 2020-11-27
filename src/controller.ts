import { BrowserWindow } from 'electron';
import Model from './model';

import { ipcMain, dialog } from 'electron';
import { Extractor } from './extractor';
import { Tesseract } from './tesseract';
import path from 'path';


export class Controller {
    private mainWindow?: Electron.BrowserWindow; 
    private model = new Model();

    constructor()
    {
        this.setupIpc();
        this.setupNotifications();
    }

    setWindow(window: Electron.BrowserWindow)
    {
        this.mainWindow = window;
    }

    setupNotifications()
    {
        this.model.fileNameSubject.subscribe((fileName: string) => {
            this.notifyView('file-selected', fileName);
        })
    }

    notifyView(channel: string, data: any) {
        this.mainWindow?.webContents.send(channel, data);
    }


    setupIpc()
    {
        let model = this.model; // for closure

        ipcMain.on('select-file', function (event: any) {
            event.reply('status-updated', "Selecting file...");
            var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
            if (paths) {
                model.setCurrentFile(paths[0]);
                event.reply('status-updated', "File selected");
                
                // let extractor = new Extractor(paths[0]);
                // extractor.extract().then(() => {
                //     console.log(" it worked. now to load an image i guess");
                // }).catch((error: any) => {
                //     console.log("reporting error from ipcmain");
                //     console.log(error);
                // });
            }
            else {
                event.reply('status-updated', "Idle")
            }
        });


        ipcMain.on('select-image', function (event: any) {
            var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
            if (paths) {
                let ext = path.extname(paths[0]);
                if (ext == '.jpg') {
                    event.sender.send('set-image', paths[0]);
                    let tesseract = new Tesseract(paths[0]);
                    tesseract.preprocess();
                    tesseract.interpret().catch((error: any) => {
                        console.log('tess process error', error);
                    });
                }
            }
        });
    }

}