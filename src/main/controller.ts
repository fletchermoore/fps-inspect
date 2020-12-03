import { BrowserWindow } from 'electron';
import Model from './model';

import { ipcMain, dialog } from 'electron';

import { Extractor } from './extractor';
import { Tesseract } from './tesseract';
import path from 'path';
import fs from 'fs';
import * as files  from './files';
import * as constants from './constants';
import { frameFrom } from './parser';



interface DataPoint {
    frame: string;
    position: RegExpMatchArray | null;
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
    processImages = async () => {
        try {
            const matchingFiles = files.matching(this.model.outputDir(), this.model.imageNamePattern());
            console.log("process found # matches: ", matchingFiles.length);
            for (let i = 0; i < matchingFiles.length; i++) {
                let fullPath = matchingFiles[i];
                console.log('processing ' + fullPath);
                let tesseract = new Tesseract(fullPath);
                await tesseract.process();
                console.log('successfullly processed ' + fullPath);
            }
        } catch(err: any) {
            this.updateStatus(err);
        }
    }

    writeDataFile = (data: Array<DataPoint>) => {
        let content = '';
        for(let i = 0; i < data.length; i++) {
            // console.log('i',i);
            // console.log('data',data);
            // console.log('position', data.position);
            let dataPoint = data[i];
            let imageNumbers = dataPoint.position?.join(',') ?? '';
            let line = dataPoint.frame + ',' + imageNumbers + constants.NEWLINE;
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
        const matchingFiles = files.matching(this.model.outputDir(), this.model.textNamePattern())
        const data : Array<DataPoint> = matchingFiles.map((fullPath: string) => {
            console.log('found',fullPath);
            try {
                const content = fs.readFileSync(fullPath, 'utf8'); 
                console.log(content);
                const pattern = /\d+/g;
                const matches = content.match(pattern);
                return {
                    frame: frameFrom(fullPath),
                    position: matches
                };
            } catch(error) {
                console.log(error);
                console.log('open file failed:', fullPath);
                return {
                    frame: '-1',
                    position: ['ERR']
                }
            }
        });        
        console.log(data);
        this.writeDataFile(data);
    }

    // = () => is different from a regular function declaration
    // it allows binding of this when passed as a callback
    // not sure why this works
    onTest = () =>
    {
        let testPath = 'C:\\Users\\fletcher\\projects\\fps-inspect\\demo\\briefradiant\\briefradiant_0100_tess.jpg'
        this.model.setCurrentImagePath(testPath);
        //console.log(frameFrom(testPath));
    }

    onOpenFile = () => 
    {
        this.model.updateStatus("Selecting file...");
        var paths = dialog.showOpenDialogSync({ properties: ['openFile', 'multiSelections'] });
        if (paths) {
            this.model.setCurrentFile(paths[0]);
            this.model.updateStatus("File selected");
            try {
                this.extractMpeg().then(() => {
                    console.log('in theory, extracted, try process...');
                    this.processImages().then(() => {
                        console.log('in theory processed, try create datafile');
                        this.createDataFile();
                    })
                });
            } catch (err: any) {
                this.updateStatus(err);
            }            
        }
        else {
            this.model.updateStatus("Idle")
        }
    }

    async extractMpeg() {
        console.log('about to check before extract');
        if (!fs.existsSync(this.model.outputDir())) {
            console.log('folder doesnt exist');
            try {
                let extractor = new Extractor(this.model.videoPath());
                await extractor.extract();
            } catch (error: any) {
                this.updateStatus("Error during video decomposition.");
                console.log(error);
                throw Error('Extraction from mp4 failed');
            };
        }
        else {
            console.log('folder already exists. skipping extract');
            throw Error('Output folder already exists. Aborted.');
        }
    }


    setupIpc()
    {
        const onOpenFile = this.onOpenFile;
        ipcMain.on('select-file', function (event: any) {
            onOpenFile();
        });

        const onTest = this.onTest;
        ipcMain.on('test', function (event: any) {
           onTest();
        });
    }

}