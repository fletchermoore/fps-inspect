const fs = require('fs');


export async function matching(dir: string, query: string) {
    try {
        const reFilter = new RegExp(query);
        const files = fs.readdirSync(dir);
        console.log('trying '+ query);
        return files.filter((file : string) => {
            return reFilter.test(file);
        }).slice(-2);
    }
    catch (err) {
        console.log(err);
        throw Error("Failed to find images. Directory not found");
    }
}