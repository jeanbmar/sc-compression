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
const ScCompression = require('sc-compression');

readdirSync('coc-13.0.4/logic/').forEach((file) => {
    const buffer = readFileSync(file);
    writeFileSync(file, ScCompression.decompress(buffer));
});
```
See tests for additional examples.
