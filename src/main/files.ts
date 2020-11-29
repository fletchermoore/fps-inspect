const fs = require('fs');
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