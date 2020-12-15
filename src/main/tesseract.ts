import util from 'util';
import path from 'path';
//const fs = require('fs').promises;
const exec = util.promisify(require('child_process').exec);
import jimp from 'jimp';
import * as constants from './constants';


const tess_suffix = constants.POSTFIX;
const ext = '.jpg';

export class Tesseract
{
    private filepath = '';
    private filenameWithoutExt: string = '';
    private outDir: string = '';
    private preprocessedImagePath = '';

    constructor(filepath: string)
    {
        this.filepath = filepath;
        this.filenameWithoutExt = path.basename(filepath, ext);
        this.outDir = path.dirname(filepath);
    }

    async process()
    {
        try {
            await this.preprocess();
            await this.interpret();
        }
        catch(err) {
            throw Error(err);
        }
    }
    
    async preprocess()
    {
        this.preprocessedImagePath = path.join(this.outDir, this.filenameWithoutExt + tess_suffix + ext);
        console.log('preprocessing', this.preprocessedImagePath);
        try {
            await jimp.read(this.filepath).then(
                (img: any) => {
                    img.crop(75, 34, 330, 138)
                        .greyscale()
                        .invert()
                        .writeAsync(this.preprocessedImagePath);
                });
        }
        catch(error: any) {
            console.log('jimp error', error);
            throw Error("Failed to jimp");
        }
    }

    async interpret()
    {        
        if (this.preprocessedImagePath == '') {
            throw Error('preprocessing not done');
        }

        console.log('about to interpret');

        let outName = path.join(this.outDir, this.filenameWithoutExt + tess_suffix);

        let tessCommand = "tesseract.exe " + this.preprocessedImagePath + " " 
            + outName;

        try
        {
            const {stdout, stderr} = await exec(tessCommand);
            console.log('stdout:', stdout);
            console.error('stderr:', stderr);
        }
        catch (error)
        {
            console.log(error);
            throw Error('Failed to interpret');
        }
    }
}