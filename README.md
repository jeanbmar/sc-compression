# sc-compression
## Install
``npm install sc-compression``
## Use
```javascript
const ScCompression = require('sc-compression')
const { readdirSync, readFileSync, writeFileSync } = require('fs');

readdirSync('coc-13.0.4/logic/').forEach((file) => {
    const buffer = readFileSync(file);
    writeFileSync(file, ScCompression.decompress(buffer));
});
```
