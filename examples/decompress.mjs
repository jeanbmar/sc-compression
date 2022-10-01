/* eslint-disable no-console */
import { readdir, readFile, writeFile, lstat } from 'node:fs/promises';
import { resolve } from 'node:path';
import readline from 'node:readline';
import { decompress } from 'sc-compression';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('enter a filepath or a directory:', async (anyPath) => {
  const stat = await lstat(anyPath);
  if (stat.isFile()) {
    console.log(`decompressing ${anyPath}...`);
    const filepath = resolve(anyPath);
    const buffer = await readFile(filepath);
    const decompressed = await decompress(buffer);
    await writeFile(filepath, decompressed);
    console.log('done!');
  } else {
    console.log(`decompressing files in ${anyPath}...`);
    const files = await readdir(anyPath);
    // eslint-disable-next-line no-restricted-syntax
    for (const file of files) {
      const filepath = resolve(anyPath, file);
      const buffer = await readFile(filepath);
      const decompressed = await decompress(buffer);
      await writeFile(filepath, decompressed);
    }
    console.log('done!');
  }
  rl.close();
  process.exit(0);
});
