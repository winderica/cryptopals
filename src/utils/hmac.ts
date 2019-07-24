import { bytes2str, hex2str, str2bytes } from './converter';

const xor = (x: string, y: string) => {
    x.padEnd(y.length, '\x00');
    y.padEnd(x.length, '\x00');
    const xx = str2bytes(x);
    const yy = str2bytes(y);
    return bytes2str(xx.map((i, j) => yy[j] ^ i));
};

interface Hash {
    digest: (message: string) => string;
}

export function hmac(key: string, message: string, Algorithm: new() => Hash) {
    const hash = new Algorithm();
    const digest = hash.digest.bind(hash);
    if (key.length > 64) {
        key = digest(key);
    }
    const opad = '\x5c'.repeat(64);
    const ipad = '\x36'.repeat(64);
    return digest(xor(opad, key) + hex2str(digest(xor(ipad, key) + message)));
}
