export function rotateLeft(x: number, shift = 1, bits = 8) {
    return x << shift | x >>> (bits - shift);
}

export function rotateRight(x: number, shift = 1, bits = 8) {
    return x >>> shift | x << (bits - shift);
}
