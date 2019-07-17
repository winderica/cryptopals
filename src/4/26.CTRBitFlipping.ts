import { bytes2hex, hex2bytes } from 'utils/converter';
import { randomString } from 'utils/random';
import { SimpleAES } from 'utils/simpleAES';

const prefix = 'comment1=cooking%20MCs;userdata=';
const key = randomString();
const nonce = randomString();
const suffix = ';comment2=%20like%20a%20pound%20of%20bacon';
const aes = new SimpleAES('aes-128-ctr', key, nonce);

function encrypt(data: string) {
    data = data.replace(/[;=]/g, '');
    return aes.encrypt(prefix + data + suffix, 'ascii', 'hex');
}

function decrypt(cipher: string) {
    return aes.decrypt(cipher, 'hex', 'ascii');
}

export function bitFlipping() {
    const str = ';admin=true';
    const char = '\x01';
    const data = char.repeat(str.length);
    const crafted = bytes2hex(
        hex2bytes(encrypt(data))
            .map((i, j) => j >= 32 && j < 32 + str.length ? i ^ str.charCodeAt(j - 32) ^ char.charCodeAt(0) : i)
    );
    return decrypt(crafted);
}
