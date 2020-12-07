import path from 'path';
import { BehaviorSubject } from 'rxjs';
import fs from 'fs';
import * as constants from './constants';


export default class Model {

    private _videoPath = '';
    private _currentFileDir = '';
    private currentFileExt = '';
    private currentFileBaseName = '';
    private currentImagePath = '';
    private data : Array<DataPoint> = [];

    fileNameSubject = new BehaviorSubject('');
    statusSubject = new BehaviorSubject('Idle');
    currentImageSubject = new BehaviorSubject('');

    
    setData(data: Array<DataPoint>)
    {
        this.data = data;
        this.statusSubject.next('Output files read.');
    }

    getData() {
        return this.data;
    }

    results()
    {
        return this.data.map((dataPoint) => {
            let num = "ERROR";
            if (dataPoint.position != null) {
                num = dataPoint.position[0];
            }
            return {
                id: dataPoint.frame,
                src: this.toImagePath(dataPoint.path),
                num: num
            }
        })
    }

    toImagePath(txtPath: string) { 
        return txtPath.slice(0,-3) + "jpg";
    }


    setCurrentFile(filePath: string)
    {
        this._videoPath = filePath;
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

    videoPath() {
        return this._videoPath;
    }

    dataFilePath() {
        if (this._videoPath != '') {
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
}
