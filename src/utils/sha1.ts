import { chunkArray } from 'utils/chunkArray';
import { str2bytes } from 'utils/converter';
import { rotateLeft } from 'utils/rotate';
import { concatUint8 } from 'utils/uint';

export class SHA1 {
    protected readonly h = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0];
    private readonly k = [0x5A827999, 0x6ED9EBA1, 0x8F1BBCDC, 0xCA62C1D6];

    pad(message: string) {
        const length = message.length;
        const padded = new Uint8Array(~~((length - 56) / 64 + 2) * 64);
        str2bytes(message).forEach((i, j) => padded[j] = i);
        padded[length] = 0x80;
        let quotient = length * 8;
        let index = padded.length - 1;
        for (; quotient >= 256; quotient = ~~(quotient / 256), index--) {
            padded[index] = quotient % 256;
        }
        padded[index] = quotient;
        return padded;
    }

    digest(message: string) {
        const h = Uint32Array.from(this.h);
        chunkArray(this.pad(message), 64).map((chunk) => {
            const w = chunkArray(chunk, 4).map(concatUint8);
            for (let i = 16; i < 80; i++) {
                w[i] = rotateLeft(w[i - 3] ^ w[i - 8] ^ w[i - 14] ^ w[i - 16], 1, 32);
            }
            let [a, b, c, d, e] = h;
            for (let i = 0; i < 80; i++) {
                const f = [(b & c) | ((~b) & d), b ^ c ^ d, (b & c) | (b & d) | (c & d), b ^ c ^ d][~~(i / 20)];
                const k = this.k[~~(i / 20)];
                [a, b, c, d, e] = Uint32Array.from([rotateLeft(a, 5, 32) + f + e + k + w[i], a, rotateLeft(b, 30, 32), c, d]);
            }
            [a, b, c, d, e].map((i, j) => h[j] += i);
        });
        return [...h].map((i) => i.toString(16).padStart(8, '0')).join('');
    }
}
