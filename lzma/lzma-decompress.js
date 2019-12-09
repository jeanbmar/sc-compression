const lzma = require('lzma-native');

module.exports = () => (
    ([compressed]) => lzma.LZMA().decompress(compressed)
);
