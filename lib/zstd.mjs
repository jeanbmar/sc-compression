import { ZstdCodec } from 'zstd-codec';

const codec = await new Promise((resolve) => {
  ZstdCodec.run((zstd) => {
    resolve(new zstd.Simple());
  });
});

export default codec;
