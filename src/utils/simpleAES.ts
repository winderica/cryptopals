import { base64DecodeAsCharCode, base64EncodeFromCharCode } from '../1/1.hex2base64';
import { padPKCS7, unpadPKCS7 } from '../2/9.pkcs7';
import { GF256 } from './gf256';

type Algorithm =
    'aes-128-ecb'
    | 'aes-192-ecb'
    | 'aes-256-ecb'
    | 'aes-128-cbc'
    | 'aes-192-cbc'
    | 'aes-256-cbc';

type MessageEncoding = 'utf8' | 'ascii';

type CipherEncoding = 'base64' | 'hex';

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
    private sBoxInv = new Uint8Array(256)
        .map((i, j) => this.rotateLeft(j)
            ^ this.rotateLeft(j, 3)
            ^ this.rotateLeft(j, 6)
            ^ 0x05
        )
        .map((i) => GF256.inverse(i));

    constructor(algorithm: Algorithm, key: string, iv = '') {
        if (key.length !== +algorithm.split('-')[1] / 8) {
            throw new Error('Invalid key!');
        }
        if (iv.length !== 16 && algorithm.includes('cbc')) {
            throw new Error('Invalid iv!');
        }
        this.algorithm = algorithm;
        this.key = key;
        this.iv = iv;
    }

    encrypt(plaintext: string, messageEncoding: MessageEncoding, cipherEncoding: CipherEncoding) {
        const plainBytes = padPKCS7(this.textConverter(plaintext, messageEncoding));
        const textBlocks = this.chunkIntoBlocks(plainBytes, 16);
        const keyBlocks = this.keyExpansion(this.textConverter(this.key, messageEncoding));
        const keyStates = keyBlocks.map(this.transpose);
        let cipher;
        if (this.algorithm.includes('cbc')) {
            const ivs = [this.textConverter(this.iv, messageEncoding)];
            cipher = textBlocks.map((textBlock, index) => {
                ivs[index + 1] = this.encryptCore(keyStates, this.addRoundKey(textBlock, ivs[index]));
                return [...ivs[index + 1]];
            }).flat();
        } else {
            cipher = textBlocks.map((textBlock) => [...this.encryptCore(keyStates, textBlock)]).flat();
        }
        return this.cipherConverter(Uint8Array.from(cipher), cipherEncoding);
    }

    decrypt(cipher: string, cipherEncoding: CipherEncoding, messageEncoding: MessageEncoding) {
        const cipherBytes = this.cipherConverter(cipher, cipherEncoding);
        const cipherBlocks = this.chunkIntoBlocks(cipherBytes, 16);
        const keyBlocks = this.keyExpansion(this.textConverter(this.key, messageEncoding));
        const keyStates = keyBlocks.map(this.transpose).reverse();
        let plaintext;
        if (this.algorithm.includes('cbc')) {
            const ivs = [this.textConverter(this.iv, messageEncoding)];
            plaintext = cipherBlocks.map((cipherBlock, index) => {
                ivs[index + 1] = cipherBlock;
                return [...this.addRoundKey(this.decryptCore(keyStates, cipherBlock), ivs[index])];
            }).flat();
        } else {
            plaintext = cipherBlocks.map((cipherBlock) => [...this.decryptCore(keyStates, cipherBlock)]).flat();
        }
        return unpadPKCS7(this.textConverter(Uint8Array.from(plaintext), messageEncoding));
    }

    private encryptCore(keyStates: Uint8Array[], textBlock: Uint8Array) {
        let textState = this.transpose(textBlock);
        textState = this.addRoundKey(textState, keyStates[0]);
        [...new Array(this.key.length / 4 + 6)].forEach((i, j, array) => {
            textState = this.subBytes(textState);
            textState = this.shiftRows(textState);
            j + 1 !== array.length && (textState = this.mixColumns(textState));
            textState = this.addRoundKey(textState, keyStates[j + 1]);
        });
        return this.transpose(textState);
    }

    private decryptCore(keyStates: Uint8Array[], cipherBlock: Uint8Array) {
        let cipherState = this.transpose(cipherBlock);
        cipherState = this.addRoundKey(cipherState, keyStates[0]);
        [...new Array(this.key.length / 4 + 6)].forEach((i, j, array) => {
            cipherState = this.shiftRows(cipherState, true);
            cipherState = this.subBytes(cipherState, true);
            cipherState = this.addRoundKey(cipherState, keyStates[j + 1]);
            j + 1 !== array.length && (cipherState = this.mixColumns(cipherState, true));
        });
        return this.transpose(cipherState);
    }

    private textConverter(text: string, messageEncoding: MessageEncoding): Uint8Array;
    private textConverter(text: Uint8Array, messageEncoding: MessageEncoding): string;
    private textConverter(text: string | Uint8Array, messageEncoding: MessageEncoding) {
        if (typeof text === 'string') {
            return messageEncoding === 'utf8'
                ? new TextEncoder().encode(text)
                : Uint8Array.from([...text].map((i) => i.charCodeAt(0)));
        } else {
            return messageEncoding === 'utf8'
                ? new TextDecoder().decode(text)
                : String.fromCharCode(...text);
        }
    }

    private cipherConverter(cipher: string, cipherEncoding: CipherEncoding): Uint8Array;
    private cipherConverter(cipher: Uint8Array, cipherEncoding: CipherEncoding): string;
    private cipherConverter(cipher: string | Uint8Array, cipherEncoding: CipherEncoding) {
        if (typeof cipher === 'string') {
            return cipherEncoding === 'base64'
                ? base64DecodeAsCharCode(cipher)
                : Uint8Array.from(cipher.match(/.{2}/g)!.map((i) => parseInt(i, 16)));
        } else {
            return cipherEncoding === 'base64'
                ? base64EncodeFromCharCode(cipher)
                : [...cipher].map((i) => i.toString(16).padStart(2, '0')).join('');
        }
    }

    private keyExpansion(keyBlock: Uint8Array) {
        const key = this.chunkIntoBlocks(keyBlock, 4).map(this.uint8ToUint32);
        const n = key.length; // 4 | 6 | 8
        const round = n + 7; // 11 | 13 | 15
        const expanded = new Array(4 * round);
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
        return this.chunkIntoBlocks(expanded.flatMap(this.uint32ToUint8), 16);
    }

    private subBytes(state: Uint8Array, inverse = false) {
        return state.map((i) => (inverse ? this.sBoxInv : this.sBox)[i]);
    }

    private shiftRows(state: Uint8Array, inverse = false) {
        return Uint8Array.from([...new Array(4)].flatMap((i, j) =>
            inverse
                ? [...state.slice(j * 3 + 4, j * 4 + 4), ...state.slice(j * 4, j * 3 + 4)]
                : [...state.slice(j * 5, j * 4 + 4), ...state.slice(j * 4, j * 5)]
        ));
    }

    private mixColumns(state: Uint8Array, inverse = false) {
        const matrix = inverse ? [
            [14, 11, 13, 9],
            [9, 14, 11, 13],
            [13, 9, 14, 11],
            [11, 13, 9, 14]
        ] : [
            [2, 3, 1, 1],
            [1, 2, 3, 1],
            [1, 1, 2, 3],
            [3, 1, 1, 2]
        ];
        return Uint8Array.from([...new Array(16)].map((_, i) =>
            matrix[~~(i / 4)].reduce((prev, curr, j) => prev ^ GF256.multiply(state[j * 4 + i % 4], curr), 0)
        ));
    }

    private addRoundKey(state: Uint8Array, keyState: Uint8Array) {
        return state.map((i, j) => i ^ keyState[j]);
    }

    private uint8ToUint32([a0, a1, a2, a3]: number[] | Uint8Array) {
        return a0 << 24 | a1 << 16 | a2 << 8 | a3;
    }

    private uint32ToUint8(x: number) {
        return [x >>> 24 & 0xff, x >>> 16 & 0xff, x >>> 8 & 0xff, x & 0xff];
    }

    private transpose(arr: Uint8Array) {
        return Uint8Array.from([...new Array(16)].map((_, i) => arr[~~(i / 4) + 4 * (i % 4)]));
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

    private chunkIntoBlocks(arr: number[] | Uint8Array, chunkSize: number) {
        return [...new Array(Math.ceil(arr.length / chunkSize))].map((i, j) =>
            Uint8Array.from(arr.slice(j * chunkSize, (j + 1) * chunkSize))
        );
    }
}
