import { bytes2str, str2bytes } from 'utils/converter';
import { MT19937 } from 'utils/mt19937';
import { randomInt } from 'utils/random';

const seed = randomInt(0xffff);

function* keyStream(key: number) {
    const mt = new MT19937(key);
    while (true) {
        const random = mt.extractNumber();
        yield* [(random >> 24) & 0xff, (random >> 16) & 0xff, (random >> 8) & 0xff, random & 0xff];
    }
}

export function encrypt(plaintext: string) {
    const key = keyStream(seed);
    return bytes2str(str2bytes(plaintext).map((i) => i ^ key.next().value));
}

export function decrypt(cipher: string) {
    const key = keyStream(seed);
    return bytes2str(str2bytes(cipher).map((i) => i ^ key.next().value));
}

export function attack(cipher: string, partial: string) {
    for (let char1 = 0; char1 < 256; char1++) {
        for (let char2 = 0; char2 < 256; char2++) {
            const plaintext = `${bytes2str([char1, char2])}${partial}`;
            if (encrypt(plaintext) === cipher) {
                return plaintext;
            }
        }
    }
    throw new Error('Failed to decrypt');
}

export function generateToken(time: number) {
    const key = keyStream(time);
    const bytes = [...new Array(16)].map(() => key.next().value);
    return bytes2str(bytes);
}

export function checkToken(token: string) {
    const now = +new Date();
    for (let time = now - 60000; time < now; time++) {
        if (generateToken(time) === token) {
            return time;
        }
    }
    throw new Error('Token is invalid');
}
