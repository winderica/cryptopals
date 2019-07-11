import { validatePKCS7 } from './15.validatePKCS7';

export function padPKCS7(arr: Uint8Array, maxLength?: number) {
    maxLength = maxLength || ~~(arr.length / 16) * 16 + 16;
    const fillByte = maxLength - arr.length;
    return Uint8Array.from([...arr, ...new Uint8Array(fillByte).map(() => fillByte)]);
}

export function unpadPKCS7(arr: Uint8Array) {
    if (!validatePKCS7(arr)) {
        throw new Error('Invalid padding');
    }
    const fillByte = arr.slice(-1)[0];
    return arr.slice(0, arr.length - fillByte);
}
