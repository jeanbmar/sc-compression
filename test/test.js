const { readFileSync } = require('fs-extra');
const { resolve } = require('path');
const ScCompression = require('../');

const csv = "\"Barbarian\",,,,,,,,,,,,,,\n" +
    ",\"Name\",\"HasDirections\",\"VariationWeight\",\"ActionFrame\",\"ExportName\",\"Looping\",\"StopToLast\",,,,,,,\n" +
    ",\"String\",\"boolean\",\"int\",\"int\",\"String\",\"boolean\",\"boolean\",,,,,,,\n" +
    ",\"walk\",\"true\",,,\"barbarian1_run\",\"true\",\"true\",,,,,,,\n" +
    ",\"idle\",\"true\",1,,\"barbarian1_idle1\",\"true\",\"true\",,,,,,,\n" +
    ",,\"true\",1,,\"barbarian1_idle1\",\"true\",\"true\",,,,,,,\n" +
    ",\"attack\",\"true\",1,11,\"barbarian1_attack1\",\"false\",\"true\",,,,,,,\n" +
    ",,\"true\",1,11,\"barbarian1_attack2\",\"false\",\"true\",,,,,,,";


describe('ScCompression tests', function() {
    it('lzma', function () {
        const buffer = readFileSync(resolve(__dirname, 'lzma-test.csv'));
        console.log(ScCompression.decompress(buffer).toString('hex'));
    });
    it('sc', function () {
        const buffer = readFileSync(resolve(__dirname, 'sc-test.sc'));
        console.log(ScCompression.decompress(buffer).toString('hex'));
    });
    it('sclz', function () {
        const buffer = readFileSync(resolve(__dirname, 'sclz-test.sc'));
        console.log(ScCompression.decompress(buffer).toString('hex'));
    });
    it('sig', function () {
        const buffer = readFileSync(resolve(__dirname, 'sig-test.csv'));
        console.log(ScCompression.decompress(buffer).toString('hex'));
    });
    it('write', function() {
        const buffer = Buffer.from(csv, 'utf8');
        console.log(ScCompression.compress(buffer).toString('hex'));
    });
});
