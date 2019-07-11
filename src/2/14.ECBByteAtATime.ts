import { randomString } from '../utils/random';
import { SimpleAES } from '../utils/simpleAES';

const key = randomString();
const prefix = randomString(~~(Math.random() * 100));
export const unknownString = 'AES-128-ECB(random-prefix || attacker-controlled || target-bytes, random-key)\n';

function encrypt(plaintext: string) {
    return new SimpleAES('aes-128-ecb', key)
        .encrypt(prefix + plaintext + unknownString, 'ascii', 'hex');
}

function getPrefixLength() {
    // length + rest === block * 16
    let rest = 0;
    let block = 1;
    while (true) {
        while (encrypt('a'.repeat(rest + 1)).slice(0, 32 * block)
        !== encrypt('a'.repeat(++rest + 1)).slice(0, 32 * block)) ;
        if (rest !== block) {
            break;
        } else {
            block++;
        }
    }
    return {
        length: block * 16 - rest,
        rest: rest % 16
    };
}

export function byteAtATime() {
    const plaintext = [];
    const cipher = encrypt('');
    const { rest, length } = getPrefixLength();
    let size = cipher.length / 2 - 1 - length;
    while (size > rest) {
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
