import util from 'util';
import path from 'path';
import { Task } from './task';
import { TaskState } from '../common/constants'
const fs = require('fs').promises

import cp from 'child_process'; //util.promisify(require('child_process').spawn);
import { BehaviorSubject } from 'rxjs';

export class ExtractTask implements Task
{
    private videoPath: string;
    private outFolderPath: string;
    private dirName: string;
    private ffmpeg?: cp.ChildProcess;

    public status = new BehaviorSubject(TaskState.Initialized);

    constructor(selectedPath: string)
    {
        this.videoPath = selectedPath;
        let dir = path.dirname(this.videoPath);
        this.dirName = path.basename(selectedPath, path.extname(selectedPath))
        this.outFolderPath = path.join(dir, this.dirName);
        
    }

    async start()
    {       
        try {
            this.status.next(TaskState.Running);

            await fs.mkdir(this.outFolderPath); // this will fail bc dir exits
            await this.runFfmpeg();
        } catch(err) {
            this.status.next(TaskState.Failed);
            throw err;
        }
    }

    async cancel()
    {
        if (this.ffmpeg?.exitCode == null) {
            this.status.next(TaskState.Canceling);
            this.ffmpeg?.kill(2); 
        } else {
            console.log('tried to cancel, but he was already dead...');
        }
    
    }

    async runFfmpeg()
    {
        try
        {            
            this.ffmpeg = cp.spawn('ffmpeg', [
                '-i',
                this.videoPath,
                path.join(this.outFolderPath, this.dirName + "_%04d.jpg"),
                '-hide_banner'
            ], {});
            const promise = new Promise( (resolve, reject) => {
                this.ffmpeg?.on('close', () => {
                    if (this.ffmpeg?.exitCode !== 0) {
                        if (this.ffmpeg?.killed) {
                            this.status.next(TaskState.Canceled);
                        }
                        else {
                            this.status.next(TaskState.Failed);
                        }
                        reject("ffmpeg exited with code " + this.ffmpeg?.exitCode);
                    } else {
                        this.status.next(TaskState.Finished);
                        resolve('ffmpeg succes');
                    }
                });
                // I assume this won't occurr if killed by signal 2.
                this.ffmpeg?.on('error', (error:any) => {
                    console.log(error);
                    this.status.next(TaskState.Failed);
                    reject(error);
                });
            });
            await promise;
        }
        catch(error)
        {
            throw error;
        }
    }
}
