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

        this.model.statusSubject.subscribe((status: string) => {
            this.notifyView('status-updated', status);
        })
    }

    notifyView(channel: string, data: any) {
        this.mainWindow?.webContents.send(channel, data);
    }

    onTest = () =>
    {
        this.model.updateStatus('test');
        console.log('test button works');
    }

    onOpenFile = () => 
    {
        this.model.updateStatus("Selecting file...");
        var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
        if (paths) {
            this.model.setCurrentFile(paths[0]);
            this.model.updateStatus("File selected");

            // let extractor = new Extractor(paths[0]);
            // extractor.extract().then(() => {
            //     console.log(" it worked. now to load an image i guess");
            // }).catch((error: any) => {
            //     console.log("reporting error from ipcmain");
            //     console.log(error);d
            // });
        }
        else {
            this.model.updateStatus("Idle")
        }
    }

    // Todo: setup notification and remove event param
    onSelectImage = (event: any) => {
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
    }

    setupIpc()
    {
        const onOpenFile = this.onOpenFile;
        ipcMain.on('select-file', function (event: any) {
            onOpenFile();
        });

        const onSelectImage = this.onSelectImage;
        ipcMain.on('select-image', function (event: any) {
            onSelectImage(event);
        });

        const onTest = this.onTest;
        ipcMain.on('test', function (event: any) {
           onTest();
        });
    }

}