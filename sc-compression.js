const forceSync = require('sync-rpc');
const md5 = require('md5');
const lzham = require('./lzham');
const lzmaDecompress = require.resolve('./lzma/lzma-decompress');
const lzmaCompress = require.resolve('./lzma/lzma-compress');

const signatures = {
    NONE: 0,
    LZMA: 1, // starts with 5D 00 00 04
    SC: 2, // starts with SC
    SCLZ: 3, // starts with SC and contains SCLZ
    SIG: 4, // starts with Sig:
};

class ScCompression {
    static decompress(buffer) {
        const signature = this.readSignature(buffer);
        if (signature === signatures.NONE) {
            return buffer;
        } else if (signature === signatures.LZMA) {
            const uncompressedSize = buffer.readInt32LE(5);
            const padded = Buffer.concat([
                buffer.slice(0, 9),
                Buffer.allocUnsafe(4).fill(uncompressedSize === -1 ? 0xFF : 0),
                buffer.slice(9),
            ]);
            const decompress = forceSync(lzmaDecompress);
            return decompress([padded]);
        } else if (signature === signatures.SC) {
            buffer = buffer.slice(26);
            const uncompressedSize = buffer.readInt32LE(5);
            const padded = Buffer.concat([
                buffer.slice(0, 9),
                Buffer.allocUnsafe(4).fill(uncompressedSize === -1 ? 0xFF : 0),
                buffer.slice(9),
            ]);
            const decompress = forceSync(lzmaDecompress);
            return decompress([padded]);
        } else if (signature === signatures.SCLZ) {
            const dictSizeLog2 = buffer.readUInt8(30);
            const outputSize = buffer.readInt32LE(31);
            return lzham.decompress(buffer.slice(35), { dictSizeLog2, outputSize });
        } else if (signature === signatures.SIG) {
            buffer = buffer.slice(68);
            const uncompressedSize = buffer.readInt32LE(5);
            const padded = Buffer.concat([
                buffer.slice(0, 9),
                Buffer.allocUnsafe(4).fill(uncompressedSize === -1 ? 0xFF : 0),
                buffer.slice(9),
            ]);
            const decompress = forceSync(lzmaDecompress);
            return decompress([padded]);
        }
        throw new Error(`unknown signature ^${signature}`);
    }

    static compress(buffer, signature = signatures.SC) {
        const bufferHash = md5(buffer);
        if (signature === signatures.NONE) {
            return buffer;
        } else if (signature === signatures.LZMA || signature === signatures.SC || signature === signatures.SIG) {
            const compress = forceSync(lzmaCompress);
            const compressed = compress([buffer, { preset: 6 }]);
            buffer = Buffer.concat([compressed.slice(0, 9), compressed.slice(13)]);
        } else if (signature === signatures.SCLZ) {
            const lzhamHeader = Buffer.allocUnsafe(9);
            lzhamHeader.write('SCLZ', 0, 4, 'ascii');
            lzhamHeader.writeUInt8(18, 4);
            lzhamHeader.writeInt32LE(buffer.length, 5);
            buffer = Buffer.concat([lzhamHeader, lzham.compress(buffer)]);
        } else {
            throw new Error(`unknown signature ${signature}`);
        }
        if (signature === signatures.SC || signature === signatures.SCLZ) {
            const scHeader = Buffer.allocUnsafe(10);
            scHeader.write('SC', 0, 2, 'ascii');
            scHeader.writeInt32BE(1, 2);
            scHeader.writeInt32BE(16, 6);
            buffer = Buffer.concat([scHeader, Buffer.from(bufferHash, 'hex'), buffer]);
        } else if (signature === signatures.SIG) {
            const sigHeader = Buffer.from('5369673a', 'hex');
            const sha64 = Buffer.alloc(64);
            buffer = Buffer.concat([sigHeader, sha64, buffer]);
        }
        return buffer;
    }

    static readSignature(buffer) {
        if (Buffer.compare(buffer.slice(0, 3), Buffer.from('5d0000', 'hex')) === 0) {
            return signatures.LZMA;
        } else if (buffer.slice(0, 2).toString('utf8').toLowerCase() === 'sc') {
            if (buffer.length >= 30 && buffer.slice(26, 30).toString('utf8').toLowerCase() === 'sclz') {
                return signatures.SCLZ;
            }
            return signatures.SC;
        } else if (buffer.slice(0, 4).toString('utf8').toLowerCase() === 'sig:') {
            return signatures.SIG;
        }
        return signatures.NONE;
    }
}

module.exports = ScCompression;
