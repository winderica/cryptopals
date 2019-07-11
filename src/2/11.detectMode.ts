import { randomString } from '../utils/random';
import { SimpleAES } from '../utils/simpleAES';

function encrypt(plaintext: string) {
    const mode = Math.random() > 0.5 ? 'aes-128-ecb' : 'aes-128-cbc';
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
