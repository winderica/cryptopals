import { base64Encode } from '../1/1.hex2base64';
import { GF256 } from './gf256';

export class SimpleAES {
    algorithm: string;
    key: string;
    iv: string;
    private rcArray = Uint8Array.from([0x00, 0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36]);
    private rconArray = Uint32Array.from(this.rcArray, (i) => i << 24);
    private sBox = new Uint8Array(256)
        .map((i, j) => GF256.inverse(j))
        .map((i) => i
            ^ this.rotateLeft(i)
            ^ this.rotateLeft(i, 2)
            ^ this.rotateLeft(i, 3)
            ^ this.rotateLeft(i, 4)
            ^ 0x63
        );

    constructor(algorithm: string, key: string, iv = '') {
        this.algorithm = algorithm;
        this.key = key;
        this.iv = iv;
    }

    encrypt(plaintext: string) {
        let textBlock = Uint8Array.from([...plaintext].map((i) => i.charCodeAt(0)));
        const keyBlock = this.keyExpansion([...this.key].map((i) => i.charCodeAt(0)));
        textBlock = this.addRoundKey(textBlock, keyBlock.slice(0, 16));
        [...new Array(this.key.length / 4 + 6)].map((i, j, array) => {
            textBlock = this.subBytes(textBlock);
            textBlock = this.shiftRows(textBlock);
            j + 1 !== array.length && (textBlock = this.mixColumns(textBlock));
            textBlock = this.addRoundKey(textBlock, keyBlock.slice(16 * (j + 1), 16 * (j + 2)));
        });
        return base64Encode([...textBlock].map((i) => String.fromCharCode(i)).join(''));
    }

    private keyExpansion(keyBlock: number[]) {
        const key = [...new Uint32Array(keyBlock.length / 4)].map((i, j) =>
            this.uint8ToUint32(keyBlock.slice(j * 4, j * 4 + 4))
        );
        const n = key.length; // 4 | 6 | 8
        const round = n + 7; // 11 | 13 | 15
        const expanded = new Uint32Array(4 * round);
        for (let i = 0; i < expanded.length; i++) {
            if (i < n) {
                expanded[i] = key[i];
            } else if (i >= n && i % n === 0) {
                expanded[i] = expanded[i - n]
                    ^ this.subWord(this.rotateWord(expanded[i - 1]))
                    ^ this.rconArray[i / n];
            } else if (i >= n && n > 6 && i % n === 4) {
                expanded[i] = expanded[i - n] ^ this.subWord(expanded[i - 1]);
            } else {
                expanded[i] = expanded[i - n] ^ expanded[i - 1];
            }
        }
        return Uint8Array.from([...expanded].flatMap((i) => this.uint32ToUint8(i)));
    }

    private uint8ToUint32([a0, a1, a2, a3]: number[] | Uint8Array) {
        return a0 << 24 | a1 << 16 | a2 << 8 | a3;
    }

    private uint32ToUint8(x: number) {
        return [x >>> 24 & 0xff, x >>> 16 & 0xff, x >>> 8 & 0xff, x & 0xff];
    }

    private subBytes(textBlock: Uint8Array) {
        const textState = this.transpose(textBlock);
        return this.transpose(textState.map((i) => this.sBox[i]));
    }

    private shiftRows(textBlock: Uint8Array) {
        const textState = this.transpose(textBlock);
        return this.transpose(Uint8Array.from([...new Array(4)].flatMap((i, j) =>
            [...textState.slice(j * 5, j * 4 + 4), ...textState.slice(j * 4, j * 5)]
        )));
    }

    private mixColumns(textBlock: Uint8Array) {
        const matrix = [
            [2, 3, 1, 1],
            [1, 2, 3, 1],
            [1, 1, 2, 3],
            [3, 1, 1, 2]
        ];
        const textState = this.transpose(textBlock);
        return this.transpose(Uint8Array.from([...new Array(16)].map((_, i) =>
            matrix[~~(i / 4)].reduce((prev, curr, j) => prev ^ GF256.multiply(textState[j * 4 + i % 4], curr), 0)
        )));
    }

    private addRoundKey(textBlock: Uint8Array, keyBlock: Uint8Array) {
        const textState = this.transpose(textBlock);
        const keyState = this.transpose(keyBlock);
        return this.transpose(textState.map((i, j) => i ^ keyState[j]));
    }

    private transpose(arr: Uint8Array) {
        return Uint8Array.from([...new Array(16)]
            .map((_, i) => arr[~~(i / 4) + 4 * (i % 4)])
        );
    }

    private rotateLeft(x: number, shift = 1, bits = 8) {
        return x << shift | x >>> (bits - shift);
    }

    private rotateWord(x: number) {
        return this.rotateLeft(x, 8, 32);
    }

    private subWord(word: number) {
        return this.uint8ToUint32(this.uint32ToUint8(word).map((i) => this.sBox[i]));
    }
}
