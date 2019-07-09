export function multiKeyXOR(plaintext: string, key: string) {
    const keyLength = key.length;
    return [...plaintext]
        .map((i, j) => (i.charCodeAt(0) ^ key.charCodeAt(j % keyLength)).toString(16).padStart(2, '0'))
        .join('');
}
