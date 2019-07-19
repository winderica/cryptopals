export function concatUint8([a0, a1, a2, a3]: number[] | Uint8Array) {
    return a0 << 24 | a1 << 16 | a2 << 8 | a3;
}

export function splitUint32(x: number) {
    return [x >>> 24 & 0xff, x >>> 16 & 0xff, x >>> 8 & 0xff, x & 0xff];
}
