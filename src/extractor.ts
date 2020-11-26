import util from 'util';
import path from 'path';
const fs = require('fs').promises

const exec = util.promisify(require('child_process').exec);

const outFolderName = "out";

export class Extractor
{
    private videoPath: string;
    private outFolderPath: string;

    constructor(selectedPath: string)
    {
        this.videoPath = selectedPath;
        let dir = path.dirname(this.videoPath);
        this.outFolderPath = path.join(dir, outFolderName);
    }

    async extract()
    {       
        try {
            await fs.mkdir(this.outFolderPath); // this will fail bc dir exits
            console.log('created dir success');
            await this.runFfmpeg();
            console.log('ran ffmpeg')
        } catch(err) {
            console.log('errored at extract');
            throw err;
        }
    }

    async runFfmpeg()
    {
        let command = "ffmpeg -i " + this.videoPath + " " +
            path.join(this.outFolderPath, "out_%04d.jpg");

        try
        {
            const { stdout, stderr } = await exec(command);
            console.log('stdout:', stdout);
            console.error('stderr:', stderr);
        }
        catch(error)
        {
            console.log("errored at runffMpeg");
            throw error;
        }
    }
}
