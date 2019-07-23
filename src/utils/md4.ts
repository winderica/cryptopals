import { chunkArray } from 'utils/chunkArray';
import { hex2bytes, num2hex, str2bytes } from 'utils/converter';
import { rotateLeft } from 'utils/rotate';
import { concatUint8 } from 'utils/uint';
import { swap32 } from './endian';

export class MD4 {
    protected readonly iv = Uint32Array.from([0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476]);
    private readonly k = [0x00000000, 0x5A827999, 0x6ED9EBA1];
    private readonly s = [[3, 7, 11, 19], [3, 5, 9, 13], [3, 9, 11, 15]];
    private readonly n = [
        [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
        [0, 4, 8, 12, 1, 5, 9, 13, 2, 6, 10, 14, 3, 7, 11, 15],
        [0, 8, 4, 12, 2, 10, 6, 14, 1, 9, 5, 13, 3, 11, 7, 15]
    ];

    pad(message: string) {
        const l0 = message.length;
        const l1 = ~~((l0 - 56) / 64 + 2) * 64;
        const padded = new Uint8Array(l1);
        str2bytes(message + '\x80' + '\x00'.repeat(l1 - 9 - l0))
            .concat(hex2bytes(num2hex(swap32(l0 * 8), 16)))
            .forEach((i, j) => padded[~~(j / 4) * 4 + 3 - j % 4] = i);
        return padded;
    }

    digest(message: string) {
        const { round, pad } = this;
        chunkArray(pad(message), 64)
            .map((i) => chunkArray(i, 4))
            .map((i) => i.map(concatUint8))
            .map((x) => {
                let [a, b, c, d] = this.iv;
                for (let r = 0; r < 3; r++) {
                    for (let t = 0; t < 16; t += 4) {
                        const [x0, x1, x2, x3] = [0, 1, 2, 3].map((i, j) => x[this.n[r][t + j]]);
                        const [s0, s1, s2, s3] = this.s[r];
                        a = round(r)([a, b, c, d], x0, s0);
                        d = round(r)([d, a, b, c], x1, s1);
                        c = round(r)([c, d, a, b], x2, s2);
                        b = round(r)([b, c, d, a], x3, s3);
                    }
                }
                [a, b, c, d].map((i, j) => this.iv[j] += i);
            });

        return [...this.iv].map((i) => num2hex(swap32(i), 8)).join('');
    }

    private round = (r: number) => ([a, b, c, d]: number[], x: number, s: number) => {
        const f = [(b & c) | (~b & d), (b & c) | (b & d) | (c & d), b ^ c ^ d][r];
        return rotateLeft(a + f + x + this.k[r], s, 32);
    };

}
