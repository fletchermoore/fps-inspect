import { BrowserWindow } from 'electron';
import Model from './model';

import { ipcMain, dialog } from 'electron';

import { Tesseract } from './tesseract';
import path from 'path';
import fs from 'fs';
import * as files  from './files';


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

        this.model.currentImageSubject.subscribe((path: string) => {
            this.notifyView('image-set', path);
        })
    }

    notifyView(channel: string, data: any) {
        this.mainWindow?.webContents.send(channel, data);
    }

    // compromise, convenience
    updateStatus(status: string)
    {
        this.model.updateStatus(status);
    }

    // = () => is different from a regular function declaration
    // it allows binding of this when passed as a callback
    // not sure why this works
    onTest = () =>
    {
        files.matching(this.model.outputDir(), this.model.imageNamePattern())
            .then((matchingFiles: any) => {
                matchingFiles.forEach((name: string) => {
                    console.log('processing '+name);
                    let filePath = path.join(this.model.outputDir(), name);
                    let tesseract = new Tesseract(filePath);
                    tesseract.process().then(() => {
                        console.log('successfullly processed ' + name);
                    }).catch((error: string) => {
                        console.log('tess process error', error);
                    })
                });
            }).catch((err: string) => {
                this.updateStatus(err);
            });
    }

    onOpenFile = () => 
    {
        this.model.updateStatus("Selecting file...");
        var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
        if (paths) {
            this.model.setCurrentFile(paths[0]);
            this.model.updateStatus("File selected");
            this.model.extractMpeg(); 
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
                this.model.setCurrentImagePath(paths[0]);
                //event.sender.send('set-image', paths[0]);
                // let tesseract = new Tesseract(paths[0]);
                // tesseract.preprocess();
                // tesseract.interpret().catch((error: any) => {
                //     console.log('tess process error', error);
                // });
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