/* eslint-disable no-param-reassign */
import { Buffer } from 'node:buffer';
import * as lzham from './lzham.mjs';
import * as lzma from './lzma.mjs';

const crypto = await import('node:crypto');

const readSignature = (buffer) => {
  if (Buffer.compare(buffer.slice(0, 3), Buffer.from('5d0000', 'hex')) === 0) {
    return 'lzma';
  }
  if (buffer.slice(0, 2).toString('utf8').toLowerCase() === 'sc') {
    if (
      buffer.length >= 30 &&
      buffer.slice(26, 30).toString('utf8').toLowerCase() === 'sclz'
    ) {
      return 'sclz';
    }
    if (buffer.indexOf('START', 'utf8') > -1) {
      return 'sc2';
    }
    return 'sc';
  }
  if (buffer.slice(0, 4).toString('utf8').toLowerCase() === 'sig:') {
    return 'sig';
  }
  return 'none';
};

const decompress = async (buffer) => {
  const signature = readSignature(buffer);
  if (signature === 'sclz') {
    const dictSizeLog2 = buffer.readUInt8(30);
    const outputSize = buffer.readInt32LE(31);
    return lzham.decompress(buffer.slice(35), { dictSizeLog2, outputSize });
  }
  if (signature === 'sc') {
    buffer = buffer.slice(26);
  } else if (signature === 'sc2') {
    buffer = buffer.slice(30);
    const endOffset = buffer.indexOf('START', 'utf8');
    buffer = buffer.slice(0, endOffset);
  } else if (signature === 'sig') {
    buffer = buffer.slice(68);
  }
  if (['lzma', 'sc', 'sc2', 'sig'].includes(signature)) {
    const uncompressedSize = buffer.readInt32LE(5);
    const padded = Buffer.concat([
      buffer.slice(0, 9),
      Buffer.allocUnsafe(4).fill(uncompressedSize === -1 ? 0xff : 0),
      buffer.slice(9),
    ]);
    return lzma.decompress(padded);
  }
  return buffer;
};

const compress = async (buffer, signature = 'sc') => {
  if (signature === 'none') return buffer;
  if (signature === 'lzma' || signature === 'sc' || signature === 'sig') {
    const compressed = await lzma.compress(buffer, { preset: 6 });
    buffer = Buffer.concat([compressed.slice(0, 9), compressed.slice(13)]);
  } else if (signature === 'sclz') {
    const lzhamHeader = Buffer.allocUnsafe(9);
    lzhamHeader.write('SCLZ', 0, 4, 'ascii');
    lzhamHeader.writeUInt8(18, 4);
    lzhamHeader.writeInt32LE(buffer.length, 5);
    buffer = Buffer.concat([lzhamHeader, lzham.compress(buffer)]);
  } else {
    throw new Error(`invalid signature ${signature}`);
  }
  if (signature === 'sc' || signature === 'sclz') {
    const scHeader = Buffer.allocUnsafe(10);
    scHeader.write('SC', 0, 2, 'ascii');
    scHeader.writeInt32BE(1, 2);
    scHeader.writeInt32BE(16, 6);
    const bufferHash = crypto.createHash('md5').update(buffer).digest('hex');
    buffer = Buffer.concat([scHeader, Buffer.from(bufferHash, 'hex'), buffer]);
  } else if (signature === 'sig') {
    const sigHeader = Buffer.from('5369673a', 'hex');
    const sha64 = Buffer.alloc(64);
    buffer = Buffer.concat([sigHeader, sha64, buffer]);
    // eslint-disable-next-line no-console
    console.warn(
      'compressed sig files cannot be signed, which will result in client crashes'
    );
  }
  return buffer;
};

export { compress, decompress, readSignature };
