import { createHmac } from 'crypto';
import { hex2str } from 'utils/converter';

export const mac = '1'.repeat(16);

export function hmacSHA1(key: string, message: string) {
    // use native library here to reduce the time of hashing
    return createHmac('sha1', key).update(message, 'ascii').digest('hex');
}

function sleep(time: number) {
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, time);
}

export async function checkHash(message: string, signature: string, delay: number) {
    const hash = hex2str(hmacSHA1(mac, message));
    signature = hex2str(signature);
    for (let i = 0; i < hash.length; i++) {
        if (hash[i] !== signature[i]) {
            return 500;
        }
        sleep(delay);
    }
    return 200;
}
