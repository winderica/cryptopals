import { base64Decode } from '../1/1.hex2base64';
import { unpadPKCS7 } from '../2/9.pkcs7';
import { bytes2hex, bytes2str, hex2bytes, str2bytes } from '../utils/converter';
import { randomItem, randomString } from '../utils/random';
import { SimpleAES } from '../utils/simpleAES';

const strings = [
    'MDAwMDAwTm93IHRoYXQgdGhlIHBhcnR5IGlzIGp1bXBpbmc=',
    'MDAwMDAxV2l0aCB0aGUgYmFzcyBraWNrZWQgaW4gYW5kIHRoZSBWZWdhJ3MgYXJlIHB1bXBpbic=',
    'MDAwMDAyUXVpY2sgdG8gdGhlIHBvaW50LCB0byB0aGUgcG9pbnQsIG5vIGZha2luZw==',
    'MDAwMDAzQ29va2luZyBNQydzIGxpa2UgYSBwb3VuZCBvZiBiYWNvbg==',
    'MDAwMDA0QnVybmluZyAnZW0sIGlmIHlvdSBhaW4ndCBxdWljayBhbmQgbmltYmxl',
    'MDAwMDA1SSBnbyBjcmF6eSB3aGVuIEkgaGVhciBhIGN5bWJhbA==',
    'MDAwMDA2QW5kIGEgaGlnaCBoYXQgd2l0aCBhIHNvdXBlZCB1cCB0ZW1wbw==',
    'MDAwMDA3SSdtIG9uIGEgcm9sbCwgaXQncyB0aW1lIHRvIGdvIHNvbG8=',
    'MDAwMDA4b2xsaW4nIGluIG15IGZpdmUgcG9pbnQgb2g=',
    'MDAwMDA5aXRoIG15IHJhZy10b3AgZG93biBzbyBteSBoYWlyIGNhbiBibG93'
];
const origin = base64Decode(randomItem(strings));
const key = randomString();
const iv = randomString();

function encrypt() {
    return new SimpleAES('aes-128-cbc', key, iv).encrypt(origin, 'ascii', 'hex');
}

function decrypt(cipher: string) {
    try { // valid padding
        new SimpleAES('aes-128-cbc', key, iv).decrypt(cipher, 'hex', 'ascii');
        return true;
    } catch (e) { // invalid padding
        return false;
    }
}

export function hack() {
    const cipher = encrypt();
    const bytes = str2bytes(iv).concat(hex2bytes(cipher));
    const t = new Uint8Array(bytes.length - 16);
    const decrypted = new Uint8Array(bytes.length - 16);
    for (let size = bytes.length; size >= 16; size -= 16) {
        let round = 0;
        while (round < 16) {
            const found = [];
            const current = size - round - 17;
            const bytesCopy = bytes.slice(0, size);
            for (let i = current + 1; i <= current + round; i++) {
                bytesCopy[i] = t[i] ^ (round + 1);
            }
            for (let char = 0; char < 256; char++) {
                bytesCopy[current] = char ^ (round + 1);
                if (decrypt(bytes2hex(bytesCopy))) {
                    found.push(char);
                }
            }
            if (found.length === 1) {
                decrypted[current] = found[0] ^ bytes[current];
                t[current] = found[0];
            } else if (found.length > 1) {
                for (const i of found) {
                    if ((i ^ bytes[current]) !== 1) {
                        decrypted[current] = i ^ bytes[current];
                        t[current] = i;
                        break;
                    }
                }
            }
            round++;
        }
    }
    return { decrypted: bytes2str(unpadPKCS7(decrypted)), origin };
}
