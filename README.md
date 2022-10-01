# Sc Compression
This module is intended to compress and decompress Supercell assets.  
It supports the following signatures:

| signature | description |
| --- | --- |
| `'none'` | non-compressed file |
| `'lzma'` | starts with bytes 0x5d0000 |
| `'sc'` | starts with "SC" |
| `'sc2'` | starts with "SC" and contains "START" |
| `'sclz'` | starts with "SC" and contains "SCLZ" |
| `'sig'` | starts with "Sig:" |

The module automatically infers the right signature when `decompress` is called.
## Install
`npm install sc-compression`
## API Reference
### `decompress(buffer)`
Decompress a file buffer.
- `buffer` <Buffer\> A compressed file that was read into a Node.js Buffer
- Returns: <Promise<Buffer\>\> A decompressed file buffer that can be written to disk

### `compress(buffer, signature)`
Compress a file buffer.
- `buffer` <Buffer\> A file that was read into a Node.js Buffer
- `signature` <string\> `'lzma'`, `'sc'`, `'sclz'` or `'sig'`. It is impossible to recompress an `sig` file with a valid hash, so attempting to load an `sig` file in an unpatched game client will crash.
- Returns: <Promise<Buffer\>\> A compressed file buffer that can be written to disk

### `readSignature(buffer)`
Read a compressed file signature.
- `buffer` <Buffer\> A compressed file that was read into a Node.js Buffer
- Returns: <string\> The file signature

## Example
```js
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { decompress } from 'sc-compression';

const files = await readdir('coc-13.0.4/logic');
for (const file of files) {
    const filepath = resolve(directory, file);
    const buffer = await readFile(filepath);
    const decompressed = await decompress(buffer);
    await writeFile(filepath, decompressed);
}
```
See tests for additional implementation examples.

## Step by step guide for non-developers
  - Make sure you have Node.js installed (https://nodejs.org/en/)
  - Run ``npm install -g sc-compression`` in a terminal
  - Download examples/decompress.mjs from this repository
  - Run ``node decompress.mjs`` in a terminal
  
