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
    currentImageSubject = new BehaviorSubject(''); // deprecated. nobody is listening

    
    setData(data: Array<DataPoint>)
    {
        this.data = data;
        this.statusSubject.next('Output files read.');
    }

    getData() {
        return this.data;
    }

    updateData(results: Array<ResultUpdate>) {
        this.data = this.data.map(point => {
            let correspondingResult = results.find(result => point.frame == result.frame);
            if (correspondingResult != undefined) {
                point.human = correspondingResult.value;
            }
            return point;
        });
        this.statusSubject.next('Success: updated data with human input');
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

    // deprecated
    setCurrentImagePath(imagePath: string) {
        this.currentImagePath = imagePath;
        this.currentImageSubject.next(this.currentImagePath);
    }

    framePath(frame: number) {
        // TODO: FRAME PADDING IS A HAZRD IF THIS CHANGES SOMEWHERE else
        const filename = this.currentFileBaseName + '_' + ('000000000'+frame).slice(-4) + '.jpg';
        const src = path.join(this.outputDir(), filename);
        return src;
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
