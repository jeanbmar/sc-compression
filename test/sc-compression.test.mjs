import fsp from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { strict as assert } from 'node:assert';
import path from 'node:path';
import { describe, it } from 'mocha';
import { compress, decompress } from '../lib/index.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const csv =
  '"Barbarian",,,,,,,,,,,,,,\n' +
  ',"Name","HasDirections","VariationWeight","ActionFrame","ExportName","Looping","StopToLast",,,,,,,\n' +
  ',"String","boolean","int","int","String","boolean","boolean",,,,,,,\n' +
  ',"walk","true",,,"barbarian1_run","true","true",,,,,,,\n' +
  ',"idle","true",1,,"barbarian1_idle1","true","true",,,,,,,\n' +
  ',,"true",1,,"barbarian1_idle1","true","true",,,,,,,\n' +
  ',"attack","true",1,11,"barbarian1_attack1","false","true",,,,,,,\n' +
  ',,"true",1,11,"barbarian1_attack2","false","true",,,,,,,';

describe('sc-compression', () => {
  it('lzma decompress', async () => {
    const buffer = await fsp.readFile(
      path.join(__dirname, 'assets/lzma-test.csv')
    );
    const decompressed = await decompress(buffer);
    assert(decompressed.toString('hex').length > 0);
  });
  it('lzma compress', async () => {
    const buffer = Buffer.from(csv, 'utf8');
    const compressed = await compress(buffer, 'lzma');
    const decompressed = await decompress(compressed);
    assert.strictEqual(buffer.toString('hex'), decompressed.toString('hex'));
  });
  it('sc decompress', async () => {
    const buffer = await fsp.readFile(
      path.join(__dirname, 'assets/sc-test.sc')
    );
    const decompressed = await decompress(buffer);
    assert(decompressed.toString('hex').length > 0);
  });
  it('sclz decompress', async () => {
    const buffer = await fsp.readFile(
      path.join(__dirname, 'assets/sclz-test.sc')
    );
    const decompressed = await decompress(buffer);
    assert(decompressed.toString('hex').length > 0);
  });
  it('sig decompress', async () => {
    const buffer = await fsp.readFile(
      path.join(__dirname, 'assets/sig-test.csv')
    );
    const decompressed = await decompress(buffer);
    assert(decompressed.toString('hex').length > 0);
  });
  it('default compress', async () => {
    const buffer = Buffer.from(csv, 'utf8');
    const compressed = await compress(buffer);
    assert(compressed.toString('hex').length > 0);
  });
  it('sc 2021 decompress', async () => {
    const buffer = await fsp.readFile(
      path.join(__dirname, 'assets/sc-2021.sc')
    );
    const decompressed = await decompress(buffer);
    assert(decompressed.toString('hex').length > 0);
  });
  it('coc 15.0.3', async () => {
    const buffer = await fsp.readFile(path.join(__dirname, 'assets/zstd.sc'));
    const decompressed = await decompress(buffer);
    assert(decompressed.toString('hex').length > 0);
  });
});
