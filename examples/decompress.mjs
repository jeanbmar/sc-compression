import { readdirSync, readFileSync, writeFileSync, lstatSync } from 'node:fs';
import { resolve } from 'node:path';
import readline from 'node:readline';
import { decompress } from 'sc-compression';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('enter a filepath or a directory:', (anyPath) => {
  if (lstatSync(anyPath).isFile()) {
    console.log(`decompressing ${anyPath}...`);
    const filepath = resolve(anyPath);
    const buffer = readFileSync(filepath);
    writeFileSync(filepath, decompress(buffer));
    console.log('done!');
  } else {
    console.log(`decompressing files in ${anyPath}...`);
    readdirSync(anyPath).forEach((file) => {
      const filepath = resolve(anyPath, file);
      const buffer = readFileSync(filepath);
      writeFileSync(filepath, decompress(buffer));
    });
    console.log('done!');
  }
  rl.close();
  process.exit(0);
});
