import { randomString } from '../utils/random';
import { SimpleAES } from '../utils/simpleAES';

const prefix = 'comment1=cooking%20MCs;userdata=';
const key = randomString();
const iv = randomString();
const suffix = ';comment2=%20like%20a%20pound%20of%20bacon';

function encrypt(data: string) {
    data = data.replace(/[;=]/g, '');
    return new SimpleAES('aes-128-cbc', key, iv).encrypt(prefix + data + suffix, 'ascii', 'hex');
}

function decrypt(cipher: string) {
    return new SimpleAES('aes-128-cbc', key, iv).decrypt(cipher, 'hex', 'ascii');
}

export function hack() {
    const str = ';admin=true';
    const char = '\x01';
    const data = char.repeat(16 + str.length);
    const crafted = encrypt(data)
        .match(/.{2}/g)!
        .map((i) => parseInt(i, 16))
        .map((i, j) => j >= 32 && j < 32 + str.length ? i ^ str.charCodeAt(j - 32) ^ char.charCodeAt(0) : i)
        .map((i) => i.toString(16).padStart(2, '0'))
        .join('');
    return decrypt(crafted).includes(';admin=true;');
}
