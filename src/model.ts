import path from 'path';
import { BehaviorSubject } from 'rxjs';


export default class Model {

    private currentFilePath = '';
    private currentFileDir = '';
    private currentFileExt = '';
    public currentFileBaseName = '';

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
}
