export function swap32(n: number) {
    return ((n & 0xFF) << 24 | (n & 0xFF00) << 8 | (n >>> 8) & 0xFF00 | (n >>> 24) & 0xFF) >>> 0;
}

export function swap16(n: number) {
    return ((n & 0xFF) << 8 | (n >> 8) & 0xFF) >>> 0;
}
