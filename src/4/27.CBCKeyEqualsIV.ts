import { bytes2str, str2bytes } from 'utils/converter';
import { randomString } from 'utils/random';
import { SimpleAES } from 'utils/simpleAES';

const prefix = 'comment1=cooking%20MCs;userdata=';
export const key = randomString();
const iv = key;
const suffix = ';comment2=%20like%20a%20pound%20of%20bacon';
const aes = new SimpleAES('aes-128-cbc', key, iv);

function encrypt(data: string) {
    data = data.replace(/[;=]/g, '');
    return aes.encrypt(prefix + data + suffix, 'ascii', 'hex');
}

function decrypt(cipher: string) {
    return aes.decrypt(cipher, 'hex', 'ascii');
}

export function attack() {
    const cipher = encrypt('');
    const crafted = cipher.slice(0, 32) + '0'.repeat(32) + cipher.slice(0, 32) + cipher.slice(96);
    const decrypted = decrypt(crafted);
    const chunks = decrypted.match(/.{1,16}/g)!.map((i) => str2bytes(i));
    return bytes2str(chunks[0].map((i, j) => i ^ chunks[2][j]));
}
