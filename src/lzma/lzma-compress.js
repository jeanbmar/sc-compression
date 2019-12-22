const lzma = require('lzma-native');

// from lzma-native, to create a custom aloneEncoder suitable for sc
const noop = () => {};
const singleStringCoding = (stream, string) => {
    if (!Buffer.isBuffer(string)) {
        string = Buffer.from(string);
    }
    const deferred = {};
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });
    deferred.promise.catch(noop);
    stream.once('error', (e) => {
        deferred.reject(e);
    });
    const buffers = [];
    stream.on('data', (b) => {
        buffers.push(b);
    });
    stream.once('end', () => {
        const result = Buffer.concat(buffers);
        deferred.resolve(result);
    });
    stream.end(string);
    return deferred.promise;
};

module.exports = () => (
    ([buffer, options]) => {
        const stream = lzma.createStream('aloneEncoder', options);
        return singleStringCoding(stream, buffer);
    }
);
