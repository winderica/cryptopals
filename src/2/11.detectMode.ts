import { randomBytes } from 'crypto';
import { SimpleAES } from '../utils/simpleAES';

function encrypt(plaintext: string) {
    const mode = Math.random() > 0.5 ? 'aes-128-ecb' : 'aes-128-cbc';
    const randomString = (length = 16) => randomBytes(100).toString('ascii').slice(0, length);
    const cipher = new SimpleAES(mode, randomString(), randomString())
        .encrypt(randomString(10) + plaintext + randomString(10), 'ascii', 'hex');
    return { cipher, mode };
}

export function detect() {
    const plaintext = 'a'.repeat(100);
    const { cipher, mode } = encrypt(plaintext);
    if (cipher.slice(32, 64) === cipher.slice(64, 96)) {
        return { mode, guess: 'aes-128-ecb' };
    }
    return { mode, guess: 'aes-128-cbc' };
}
