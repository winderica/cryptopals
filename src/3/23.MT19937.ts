import { MT19937 } from 'utils/mt19937';

function inverseRightXOR(value: number, bits: number, mask = 0xffffffff) {
    let result = 0;
    const getBits = (n: number, i: number) => {
        const shift = 32 - i * bits;
        return n & (shift >= 0 ? (((1 << bits) - 1) << shift) : (((1 << bits) - 1) >> -shift));
    };
    for (let i = 1; (i - 1) * bits < 32; i++) {
        result |= getBits(value, i) ^ ((getBits(result, i - 1) >>> bits) & getBits(mask, i));
    }
    return result;
}

function inverseLeftXOR(value: number, bits: number, mask = 0xffffffff) {
    let result = 0;
    const getBits = (n: number, i: number) => n & (((1 << bits) - 1) << ((i - 1) * bits));
    for (let i = 1; (i - 1) * bits < 32; i++) {
        result |= getBits(value, i) ^ ((getBits(result, i - 1) << bits) & getBits(mask, i));
    }
    return result;
}

const [u, d] = [11, 0xffffffff];
const [s, b] = [7, 0x9d2c5680];
const [t, c] = [15, 0xefc60000];
const l = 18;

export function clone(values: number[]) {
    const state = Uint32Array.from(values.map((value) => {
        value = inverseRightXOR(value, l);
        value = inverseLeftXOR(value, t, c);
        value = inverseLeftXOR(value, s, b);
        value = inverseRightXOR(value, u, d);
        return value >>> 0;
    }));
    return new MT19937(state);
}
