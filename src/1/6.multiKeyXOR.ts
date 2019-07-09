import { base64DecodeAsCharCode } from './1.hex2base64';
import { decrypt as decryptSingleKey } from './3.singleKeyXOR';
import { multiKeyXOR } from './5.mutliKeyXOR';

function getBytes(str: string) {
    return [...[...str].map((i) => i.charCodeAt(0).toString(2).padStart(8, '0')).join('')];
}

function getHammingDistance(str1: string, str2: string) {
    const bytes1 = getBytes(str1);
    const bytes2 = getBytes(str2);
    return bytes1.filter((i, j) => i !== bytes2[j]).length;
}

function chunk(str: string, size: number) {
    return str.match(new RegExp(`.{1,${size}}`, 'gs'))!;
}

function scoreEvaluator(cipher: string, keySize: number) {
    const chunks = chunk(cipher, keySize);
    const distance = [...new Array(20)]
        .map((i, j) => getHammingDistance(chunks[j * 2], chunks[j * 2 + 1]))
        .reduce((prev, curr) => prev + curr);
    return distance / keySize;
}

function determineKeySize(cipher: string) {
    const scoreArray = [...new Array(40)].map((i, j) => j < 2 ? Infinity : scoreEvaluator(cipher, j));
    return scoreArray.indexOf(Math.min(...scoreArray));
}

function transpose(block: string[]) {
    return [...block[0]]
        .map((col, i) => block
            .map((row) => row[i] && row[i].charCodeAt(0).toString(16).padStart(2, '0'))
            .join('')
        );
}

export function decrypt(buffer: Buffer) {
    const decoded = base64DecodeAsCharCode(buffer.toString().split('\n').join('')).map((i) => String.fromCharCode(i)).join('');
    const keySize = determineKeySize(decoded);
    const block = chunk(decoded, keySize);
    const transposed = transpose(block);
    const key = transposed.map((i) => String.fromCharCode(decryptSingleKey(i).key)).join('');
    const plaintext = chunk(multiKeyXOR(decoded, key), 2).map((i) => String.fromCharCode(parseInt(i, 16))).join('');
    return { plaintext, key };
}
