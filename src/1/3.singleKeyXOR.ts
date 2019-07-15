import { hex2bytes } from 'utils/converter';

export function simpleEvaluator(str: string) {
    let score = 0;
    for (const char of str) {
        if (!/[\w\s'".,?!:;\-()\[\]]/.test(char)) return 0;
        char.toLowerCase() > 'a' && char.toLowerCase() <= 'z' && score++;
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
