let lzma = require('lzma');
let fs = require('fs-extra');

class LzmaFile {

    static readSync(filename) {
        let buffer = fs.readFileSync(filename);
        if (buffer.slice(0, 3).toString('hex') === '5d0000') {
            buffer = Buffer.concat([buffer.slice(0, 9), Buffer.alloc(4), buffer.slice(9)]);
            buffer = lzma.decompress(buffer).toString('utf8');
        }
        return buffer.toString('utf8');
    }

    static writeSync(filename, buffer) {
        let compressed = Buffer.from(lzma.compress(buffer, 2));
        fs.outputFileSync(filename, Buffer.concat([compressed.slice(0, 9), compressed.slice(13)]));
    }
}

module.exports = LzmaFile;