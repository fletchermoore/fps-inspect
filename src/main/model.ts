import path from 'path';
import { BehaviorSubject } from 'rxjs';
import fs from 'fs';
import { Extractor } from './extractor';
import * as constants from './constants';


export default class Model {

    private currentFilePath = '';
    private _currentFileDir = '';
    private currentFileExt = '';
    private currentFileBaseName = '';
    private currentImagePath = '';

    fileNameSubject = new BehaviorSubject('');
    statusSubject = new BehaviorSubject('Idle');
    currentImageSubject = new BehaviorSubject('');

    
    setCurrentFile(filePath: string)
    {
        this.currentFilePath = filePath;
        this._currentFileDir = path.dirname(filePath);
        this.currentFileExt = path.extname(filePath);
        this.currentFileBaseName = path.basename(filePath, this.currentFileExt);
        this.fileNameSubject.next(this.currentFileBaseName);
    }

    setCurrentImagePath(imagePath: string) {
        this.currentImagePath = imagePath;
        this.currentImageSubject.next(this.currentImagePath);
    }

    outputDir() {
        return path.join(this._currentFileDir, this.currentFileBaseName);
    }

    dataFilePath() {
        if (this.currentFilePath != '') {
            return path.join(this.outputDir(), this.currentFileBaseName + '.csv');
        } else {
            return '';
        }
    }

    imageNamePattern() {
        if (this.currentFileBaseName != '') {
            return  '^' + this.currentFileBaseName + '_\\d+\\.jpg$';
        } else {
            return '^$';
        }
    }

    textNamePattern() {
        if (this.currentFileBaseName != '') {
            return '^' + this.currentFileBaseName + '_\\d+' +constants.POSTFIX+ '\\.txt$';
        } else {
            return '^$';
        }
    }

    updateStatus(status: string)
    {
        this.statusSubject.next(status);
    }

    extractMpeg()
    {
        console.log('about to check before extract');
        if (!fs.existsSync(this.outputDir())) {
            console.log('folder doesnt exist');
            let extractor = new Extractor(this.currentFilePath);
            extractor.extract().then(() => {
                console.log(" it worked. now to load an image i guess");
            }).catch((error: any) => {
                this.updateStatus("Error during video decomposition.");
                console.log("reporting error from ipcmain");
                console.log(error);
            });
        }
        else
        {
            console.log('folder already exists. skipping extract');
        }
    }
}
