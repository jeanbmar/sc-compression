const { readdirSync, readFileSync, writeFileSync, lstatSync } = require('fs');
const { resolve } = require('path');
const readline = require('readline');
const ScCompression = require('sc-compression');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter an asset filepath or an asset directory:', (anyPath) => {
    if (lstatSync(anyPath).isFile()) {
        console.log(`Decompressing ${anyPath}...`);
        const filepath = resolve(anyPath);
        const buffer = readFileSync(filepath);
        writeFileSync(filepath, ScCompression.decompress(buffer));
        console.log('Done!');
    } else {
        console.log(`Decompressing files in ${anyPath}...`);
        readdirSync(anyPath).forEach((file) => {
            const filepath = resolve(anyPath, file);
            const buffer = readFileSync(filepath);
            writeFileSync(filepath, ScCompression.decompress(buffer));
        });
        console.log('Done!');
    }
    rl.close();
    process.exit(0);
});
