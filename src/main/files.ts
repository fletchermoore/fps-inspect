const fs = require('fs');
const csv = require('csv-parser');
import path from 'path';


export function matching(dir: string, query: string): Array<string> {
    try {
        const reFilter = new RegExp(query);
        const files = fs.readdirSync(dir);
        console.log('trying '+ query);
        return files.filter((file : string) => {
            return reFilter.test(file);
        }).map((file: string) => {
            return path.join(dir, file);
        })
    }
    catch (err) {
        console.log(err);
        throw Error("Failed to find images. Directory not found");
    }
}

export function readCsv(path: string): Array<Array<string>> {
    let results: Array<Array<string>> = [];

    fs.createReadStream(path).on('error', (error:any) => {
        console.log('csv read error',error);
    })
        .pipe(csv())
        .on('data', (data: any) => results.push(data))
        .on('end', () => {
            console.log(results);
            // [
            //   { NAME: 'Daffy Duck', AGE: '24' },
            //   { NAME: 'Bugs Bunny', AGE: '22' }
            // ]
        });

    return results;
}