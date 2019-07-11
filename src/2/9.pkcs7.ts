export function padPKCS7(arr: Uint8Array, maxLength?: number) {
    maxLength = maxLength || ~~(arr.length / 16) * 16 + 16;
    const fillByte = maxLength - arr.length;
    return Uint8Array.from([...arr, ...new Uint8Array(fillByte).map(() => fillByte)]);
}

export function unpadPKCS7(str: string) {
    const fillByte = str.charCodeAt(str.length - 1);
    return str.slice(0, str.length - fillByte);
}
