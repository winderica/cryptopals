import { decrypt as decryptBase, simpleEvaluator } from './3.singleKeyXOR';

export function decrypt(buffer: Buffer) {
    const ciphers = buffer.toString().split('\n');
    const scoreArray = ciphers.map((i) => simpleEvaluator(decryptBase(i).plaintext));
    const index = scoreArray.lastIndexOf(Math.max(...scoreArray));
    const cipher = ciphers[index];
    return { ...decryptBase(cipher), cipher };
}
