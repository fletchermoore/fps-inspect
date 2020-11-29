const fs = require('fs');
import path from 'path';


export async function matching(dir: string, query: string) {
    try {
        const reFilter = new RegExp(query);
        const files = fs.readdirSync(dir);
        console.log('trying '+ query);
        return files.filter((file : string) => {
            return reFilter.test(file);
        }).map((file: string) => {
            return path.join(dir, file);
        }).slice(-2);
    }
    catch (err) {
        console.log(err);
        throw Error("Failed to find images. Directory not found");
    }
}