import { hex2bytes } from 'utils/converter';

export function simpleEvaluator(str: string) {
    let score = 0;
    for (const char of str) {
        if (char.charCodeAt(0) >= 127 || !/[\w \n'".,?!:;\-()\[\]/]/.test(char)) {
            return 0;
        }
        if (char.toLowerCase() >= 'a' && char.toLowerCase() <= 'z') {
            score += 5;
        } else if (char === ' ' || char === '\n') {
            score += 1;
        }
    }
    return score / str.length;
}

function xor(charCodeArray: number[], key: number) {
    return charCodeArray
        .map((i) => String.fromCharCode(i ^ key))
        .join('');
}

export function decrypt(cipher: string) {
    const charCodeArray = hex2bytes(cipher);
    const scoreArray = [...new Array(256)].map((i, j) => simpleEvaluator(xor(charCodeArray, j)));
    const key = scoreArray.indexOf(Math.max(...scoreArray));
    const plaintext = xor(charCodeArray, key);
    return { key, plaintext };
}
