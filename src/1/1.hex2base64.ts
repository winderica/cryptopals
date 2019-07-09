export function base64Encode(str: string) {
    const table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    return [...new TextEncoder().encode(str)]
        .map(i => i.toString(2).padStart(8, '0'))
        .join('')
        .match(/.{1,6}/g)!
        .map(i => table[parseInt(i.padEnd(6, '0'), 2)] + '='.repeat((6 - i.length) / 2 % 3))
        .join('')
}

export function base64Decode(str: string) {
    // TODO: validation
    const table = Object.fromEntries([...'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'].map((i, j) => [i, j]));
    return new TextDecoder().decode(
        Uint8Array.from([...str]
            .map(i => i === '=' ? '' : table[i].toString(2).padStart(6, '0'))
            .join('')
            .match(/.{8}/g)!
            .map(i => parseInt(i, 2))
        )
    );
}

export function hex2base64(str: string) {
    return base64Encode(str
        .match(/.{2}/g)!
        .map(i => String.fromCharCode(parseInt(i, 16)))
        .join('')
    )
}
