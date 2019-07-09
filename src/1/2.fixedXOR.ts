export function fixedXOR(str1: string, str2: string) {
    return str1
        .split('')
        .map((i, j) => (parseInt(i, 16) ^ parseInt(str2[j], 16)).toString(16))
        .join('');
}
