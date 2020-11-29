import { BrowserWindow } from 'electron';
import Model from './model';

import { ipcMain, dialog } from 'electron';

import { Tesseract } from './tesseract';
import path from 'path';
import fs from 'fs';
import * as files  from './files';
import * as constants from './constants';


interface DataPoint {
    file: string;
    position: Array<string>;
}


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

    // run tesseract over all the extracted images
    processImages = () => {
        files.matching(this.model.outputDir(), this.model.imageNamePattern())
        .then((matchingFiles: any) => {
            matchingFiles.forEach((name: string) => {
                console.log('processing ' + name);
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

    writeDataFile = (data: Array<DataPoint>) => {
        let content = '';
        for(let i = 0; i < data.length; i++) {
            // console.log('i',i);
            // console.log('data',data);
            // console.log('position', data.position);
            let dataPoint = data[i];
            let line = '' + i + ',' + dataPoint.file + ',' + dataPoint.position.join(',') + constants.NEWLINE;
            content += line;
            // console.log(line);
        }
        if (this.model.dataFilePath() != '') {
            fs.writeFile(this.model.dataFilePath(), content, 'utf8', (error) => {
                console.log('write error', error);
            });
        }       
    }

    // create csv from text data
    createDataFile = () => {
        files.matching(this.model.outputDir(), this.model.textNamePattern())
        .then((matchingFiles: any) => {
            return matchingFiles.map((fullPath: string) => {
                console.log('found',fullPath);
                const content = fs.readFileSync(fullPath, 'utf8');
                console.log(content);
                const pattern = /\d+/g;
                const matches = content.match(pattern);
                return {
                    file: fullPath,
                    position: matches
                }
            });
        }).then((data: Array<DataPoint>) => {
            console.log(data);
            this.writeDataFile(data);
        })
    }

    // = () => is different from a regular function declaration
    // it allows binding of this when passed as a callback
    // not sure why this works
    onTest = () =>
    {
        this.createDataFile();        
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