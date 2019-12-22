# sc-compression
This module allows you to compress and decompress Supercell assets. It supports the following signatures:

| Value | Signature |                          Comment |
|------|:----------|:---------------------------------|
|    0 | NONE      | Regular non-compressed file      |
|    1 | LZMA      | Starts with 5d 00 00             |
|    2 | SC        | Starts with SC                   |
|    3 | SCLZ      | Starts with SC and contains SCLZ |
|    4 | SIG       | Starts with Sig:                 |

The module automatically finds the right signature when decompress function is called.
## Install
``npm install sc-compression``
## Available methods
  - decompress(buffer) - returns a Buffer
  - compress(buffer, signature) - returns a Buffer
  - readSignature(buffer) - returns a file signature as a Number
## Example
```javascript
const { readdirSync, readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');
const ScCompression = require('sc-compression');

const directory = 'coc-13.0.4/logic';
readdirSync(directory).forEach((file) => {
    const filepath = resolve(directory, file);
    const buffer = readFileSync(filepath);
    writeFileSync(filepath, ScCompression.decompress(buffer));
});
```
See tests for additional implementation examples.
## Step by step guide for non-developers
  - Make sure you have Node.js installed (https://nodejs.org/en/)
  - Run ``npm install -g sc-compression`` in a terminal
  - Download examples/decompress.js from this repository
  - Run ``node decompress.js`` in a terminal
  
