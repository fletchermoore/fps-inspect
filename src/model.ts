import { ipcMain } from 'electron';

import path from 'path';

export default class Model {

    private currentFilePath = '';
    private currentFileDir = '';
    private currentFileExt = '';
    public currentFileBaseName = '';

    setCurrentFile(filePath: string)
    {
        this.currentFilePath = filePath;
        this.currentFileDir = path.dirname(filePath);
        this.currentFileExt = path.extname(filePath);
        this.currentFileBaseName = path.basename(filePath, this.currentFileExt);    
    }
}
