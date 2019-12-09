const lzham = require('./lzhamlib');

function arrayToHeap(typedArray) {
    const numBytes = typedArray.length * typedArray.BYTES_PER_ELEMENT;
    const ptr = lzham._malloc(numBytes);
    const heapBytes = new Uint8Array(lzham.HEAPU8.buffer, ptr, numBytes);
    heapBytes.set(new Uint8Array(typedArray.buffer));
    return heapBytes;
}

function freeArray(heapBytes) {
    lzham._free(heapBytes.byteOffset);
}

function bufferToU8Array(buffer) {
    const a = new Uint8Array(buffer.length);
    for (let i = 0; i < buffer.length; i += 1) {
        a[i] = buffer[i];
    }
    return a;
}

function u8ArrayToBuffer(array) {
    const b = Buffer.allocUnsafe(array.length);
    for (let i = 0; i < array.length; i += 1) {
        b[i] = array[i];
    }
    return b;
}

function numberToU8Array(num) {
    const a = new Uint8Array(4);
    a[0] = num & 0xFF;
    a[1] = (num >> 8) & 0xFF;
    a[2] = (num >> 16) & 0xFF;
    a[3] = (num >> 24) & 0xFF;
    return a;
}

function u8ArrayToNumber(array) {
    return (array[3] << 24) | (array[2] << 16) | (array[1] << 8) | array[0];
}

function concatenate(ResultConstructor, ...arrays) {
    let totalLength = 0;
    for (let arr of arrays) {
        totalLength += arr.length;
    }
    const result = new ResultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}

function compressParamsToU8Array(params) {
    params = Object.assign({
        dictSizeLog2: 18,
        level: 2,
        tableUpdateRate: 8,
        maxHelperThreads: 0,
        compressFlags: 0
    }, params, { structSize: 40, numSeedBytes: 0, seedBytes: 0, tableMaxUpdateInterval: 0, tableUpdateIntervalSlowRate: 0 });
    const structSize = numberToU8Array(params.structSize);
    const dictSizeLog2 = numberToU8Array(params.dictSizeLog2);
    const level = numberToU8Array(params.level);
    const tableUpdateRate = numberToU8Array(params.tableUpdateRate);
    const maxHelperThreads = numberToU8Array(params.maxHelperThreads);
    const compressFlags = numberToU8Array(params.compressFlags);
    const numSeedBytes = numberToU8Array(params.numSeedBytes);
    const seedBytes = numberToU8Array(params.seedBytes);
    const tableMaxUpdateInterval = numberToU8Array(params.tableMaxUpdateInterval);
    const tableUpdateIntervalSlowRate = numberToU8Array(params.tableUpdateIntervalSlowRate);
    return concatenate(Uint8Array, structSize, dictSizeLog2, level, tableUpdateRate, maxHelperThreads, compressFlags, numSeedBytes, seedBytes, tableMaxUpdateInterval, tableUpdateIntervalSlowRate);
}

function decompressParamsToU8Array(params) {
    params = Object.assign({
        dictSizeLog2: 18,
        tableUpdateRate: 8,
        decompressFlags: 0
    }, params, { structSize: 32, numSeedBytes: 0, seedBytes: 0, tableMaxUpdateInterval: 0, tableUpdateIntervalSlowRate: 0});
    const structSize = numberToU8Array(params.structSize);
    const dictSizeLog2 = numberToU8Array(params.dictSizeLog2);
    const tableUpdateRate = numberToU8Array(params.tableUpdateRate);
    const decompressFlags = numberToU8Array(params.decompressFlags);
    const numSeedBytes = numberToU8Array(params.numSeedBytes);
    const seedBytes = numberToU8Array(params.seedBytes);
    const tableMaxUpdateInterval = numberToU8Array(params.tableMaxUpdateInterval);
    const tableUpdateIntervalSlowRate = numberToU8Array(params.tableUpdateIntervalSlowRate);
    return concatenate(Uint8Array, structSize, dictSizeLog2, tableUpdateRate, decompressFlags, numSeedBytes, seedBytes, tableMaxUpdateInterval, tableUpdateIntervalSlowRate);
}

const compress = lzham.cwrap('lzham_compress_memory', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);
const decompress = lzham.cwrap('lzham_decompress_memory', 'number', ['number', 'number', 'number', 'number', 'number', 'number']);

module.exports = {
    compress(buffer, params) {
        const pSource = arrayToHeap(bufferToU8Array(buffer));
        const estimatedLen = lzham._lzham_z_compressBound(buffer.length);
        const pDestLen = arrayToHeap(numberToU8Array(estimatedLen));
        const pDest = arrayToHeap(new Uint8Array(estimatedLen));
        const pParams = arrayToHeap(compressParamsToU8Array(params));
        const status = compress(pParams.byteOffset, pDest.byteOffset, pDestLen.byteOffset, pSource.byteOffset, buffer.length);
        freeArray(pSource);
        freeArray(pParams);
        if (status !== 3) {
            freeArray(pDest);
            freeArray(pDestLen);
            throw new Error(`Lzham compress failed with code ${status}`);
        }
        const destLen = u8ArrayToNumber(pDestLen);
        const result = u8ArrayToBuffer(pDest.slice(0, destLen));
        freeArray(pDestLen);
        freeArray(pDest);
        return result;
    },
    decompress(buffer, params = {}) {
        const pSource = arrayToHeap(bufferToU8Array(buffer));
        const pDestLen = arrayToHeap(numberToU8Array(params.outputSize ? params.outputSize : 1024));
        const pDest = arrayToHeap(new Uint8Array(params.outputSize ? params.outputSize : 1024));
        const pParams = arrayToHeap(decompressParamsToU8Array(params));
        const status = decompress(pParams.byteOffset, pDest.byteOffset, pDestLen.byteOffset, pSource.byteOffset, buffer.length);
        freeArray(pSource);
        freeArray(pParams);
        if (status !== 3) {
            freeArray(pDest);
            freeArray(pDestLen);
            throw new Error(`Lzham decompress failed with code ${status}`);
        }
        const destLen = u8ArrayToNumber(pDestLen);
        const result = u8ArrayToBuffer(pDest.slice(0, destLen));
        freeArray(pDestLen);
        freeArray(pDest);
        return result;
    }
};
