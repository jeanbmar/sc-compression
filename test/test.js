const path = require('path');
const fileCompressed = path.resolve(__dirname, 'test-compressed.csv');
const csv = "\"Barbarian\",,,,,,,,,,,,,,\n" +
    ",\"Name\",\"HasDirections\",\"VariationWeight\",\"ActionFrame\",\"ExportName\",\"Looping\",\"StopToLast\",,,,,,,\n" +
    ",\"String\",\"boolean\",\"int\",\"int\",\"String\",\"boolean\",\"boolean\",,,,,,,\n" +
    ",\"walk\",\"true\",,,\"barbarian1_run\",\"true\",\"true\",,,,,,,\n" +
    ",\"idle\",\"true\",1,,\"barbarian1_idle1\",\"true\",\"true\",,,,,,,\n" +
    ",,\"true\",1,,\"barbarian1_idle1\",\"true\",\"true\",,,,,,,\n" +
    ",\"attack\",\"true\",1,11,\"barbarian1_attack1\",\"false\",\"true\",,,,,,,\n" +
    ",,\"true\",1,11,\"barbarian1_attack2\",\"false\",\"true\",,,,,,,";
const Lzma = require('../lzma-file');

describe('lzma file', function() {
    it('read', function () {
        console.log(Lzma.readSync(fileCompressed));
    });
    it('write', function() {
        Lzma.writeSync(path.resolve(__dirname, 'test-decompressed.csv'), csv);
    })
});