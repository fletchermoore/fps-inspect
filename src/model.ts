import path from 'path';
import { BehaviorSubject } from 'rxjs';
import fs from 'fs';
import { Extractor } from './extractor';


export default class Model {

    private currentFilePath = '';
    private currentFileDir = '';
    private currentFileExt = '';
    private currentFileBaseName = '';

    fileNameSubject = new BehaviorSubject('');
    statusSubject = new BehaviorSubject('Idle');

    
    setCurrentFile(filePath: string)
    {
        this.currentFilePath = filePath;
        this.currentFileDir = path.dirname(filePath);
        this.currentFileExt = path.extname(filePath);
        this.currentFileBaseName = path.basename(filePath, this.currentFileExt);
        this.fileNameSubject.next(this.currentFileBaseName);
    }

    updateStatus(status: string)
    {
        this.statusSubject.next(status);
    }

    
    imageFiles()
    {
        if (this.currentFilePath != '') {
            try {
                const dirPath = path.join(this.currentFileDir, this.currentFileBaseName);
                const reMatchString = '^' + this.currentFileBaseName + '_\\d+\\.jpg$';
                console.log(reMatchString);
                const reFilter = new RegExp(reMatchString);
                const files = fs.readdirSync(dirPath);
                return files.filter(file => {
                    return reFilter.test(file);
                });
            }
            catch(err) {
                console.log(err);
                throw Error("Failed to find images. Directory not found");
            }
        }
        else
        {
            return [];
        }
    }

    extractMpeg()
    {
        if (!fs.existsSync(this.currentFileDir)) {
            let extractor = new Extractor(this.currentFilePath);
            extractor.extract().then(() => {
                console.log(" it worked. now to load an image i guess");
            }).catch((error: any) => {
                this.updateStatus("Error during video decomposition.");
                console.log("reporting error from ipcmain");
                console.log(error);
            });
        }
    }
}
