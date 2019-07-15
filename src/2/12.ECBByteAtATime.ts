import { randomString } from 'utils/random';
import { SimpleAES } from 'utils/simpleAES';
import { base64Decode } from '../1/1.hex2base64';

const key = randomString();
export const unknownString = base64Decode('Um9sbGluJyBpbiBteSA1LjAKV2l0aCBteSByYWctdG9wIGRvd24gc28gbXkgaGFpciBjYW4gYmxvdwpU' +
    'aGUgZ2lybGllcyBvbiBzdGFuZGJ5IHdhdmluZyBqdXN0IHRvIHNheSBoaQpEaWQgeW91IHN0b3A/IE5vLCBJIGp1c3QgZHJvdmUgYnkK');

function encrypt(plaintext: string) {

    return new SimpleAES('aes-128-ecb', key)
        .encrypt(plaintext + unknownString, 'ascii', 'hex');
}

export function byteAtATime() {
    let prevSize = 1;
    while (encrypt('a'.repeat(prevSize + 1)).length === encrypt('a'.repeat(++prevSize + 1)).length) ;
    let afterSize = prevSize;
    while (encrypt('a'.repeat(afterSize + 1)).length === encrypt('a'.repeat(++afterSize + 1)).length) ;
    const blockSize = afterSize - prevSize;
    if (encrypt('a'.repeat(100)).slice(blockSize * 2, blockSize * 4) === encrypt('a'.repeat(100)).slice(blockSize * 4, blockSize * 6)) {
        const plaintext = [];
        const cipher = encrypt('');
        let size = cipher.length / 2 - 1;
        while (size > 0) {
            const block = 'a'.repeat(size);
            const encrypted = encrypt(block).slice(0, cipher.length);
            for (let i = 0; i < 256; i++) {
                if (encrypt(block.concat(...plaintext, String.fromCharCode(i))).slice(0, cipher.length) === encrypted) {
                    plaintext.push(String.fromCharCode(i));
                    break;
                }
            }
            size--;
        }
        plaintext.pop();
        return plaintext.join('');
    }
    return '';
}
