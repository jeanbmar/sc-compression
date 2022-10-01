import { strict as assert } from 'node:assert';
import { describe, it } from 'mocha';
import * as lzham from '../lib/lzham.mjs';

const buffer = Buffer.from(
  'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    'Good morning Dr. Chandra. This is Hal. I am ready for my first lesson.' +
    "Hal... Dave and I believe that there's something about the mission that we weren't told." +
    "Something that the rest of the crew know and that you know. We'd like to know whether this is true.",
  'utf8'
);

const compressedBuffer = Buffer.from(
  '4f883e158476f0b20546d6f726e696e67204472562e2043676002c60d83ec9a8b843780d3ef90b035ff9e21d00c0d91a36c8c0c6ea01945b654787df06a0537000d6c8dede08096a35b968434f530c273898026e4c918007fc5fc0c58c4759ffc2ace4cf1af3c107b0d5180ac5ac0c5c48485ca25541cbeec2200561e0440a4004635f002fb3702e123f41f00c3050f08462354f2a78d4e16fa015963ec0804a0605b0edc730977834e1807e83ff31a1824596168a34381a2c009406b82a01cd8a00fda20b4763d7c58800e400c05119e98a',
  'hex'
);

describe('lzham', () => {
  it('compress', () => {
    assert.deepEqual(lzham.compress(buffer), compressedBuffer);
  });
  it('decompress', () => {
    assert.deepEqual(lzham.decompress(compressedBuffer), buffer);
  });
});
