const util = require('util');
const path = require('path');
//const fs = require('fs').promises;
const exec = util.promisify(require('child_process').exec);
const jimp = require('jimp');


const tess_suffix = "_tess";
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
    
    async preprocess()
    {
        this.preprocessedImagePath = path.join(this.outDir, this.filenameWithoutExt + tess_suffix + ext);

        jimp.read(this.filepath).then(
            (img: any) => {                
                img.crop(1049, 34, 136, 27)
                    .greyscale()
                    .invert()
                    .write(this.preprocessedImagePath);
            }
        ).catch((error: any) => {
            console.log('jimp error', error);
        })
    }

    async interpret()
    {        
        if (this.preprocessedImagePath == '') {
            throw Error('preprocessing not done');
        }

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
            throw error;
        }
    }
}