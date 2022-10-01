import { Buffer } from 'node:buffer';
import lzma from 'lzma-native';

// create a custom encoder suitable for sc
const singleStringCoding = (stream, string) => {
  const buffer = Buffer.isBuffer(string) ? string : Buffer.from(string);
  return new Promise((resolve, reject) => {
    stream.once('error', (e) => {
      reject(e);
    });
    const buffers = [];
    stream.on('data', (b) => {
      buffers.push(b);
    });
    stream.once('end', () => {
      const result = Buffer.concat(buffers);
      resolve(result);
    });
    stream.end(buffer);
  });
};

const compress = async (buffer, options) => {
  const stream = lzma.createStream('aloneEncoder', options);
  return singleStringCoding(stream, buffer);
};

const decompress = async (compressed) => lzma.LZMA().decompress(compressed);

export { compress, decompress };
