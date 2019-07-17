import { hex2bytes, str2bytes } from 'utils/converter';
import { randomString } from 'utils/random';
import { SimpleAES } from 'utils/simpleAES';

export const key = randomString();
export const nonce = randomString();

const aes = new SimpleAES('aes-128-ctr', key, nonce);

function edit(cipher: string, offset: number, newText: string) {
    const chunk = aes.encrypt('\x00'.repeat(offset) + newText, 'ascii', 'hex');
    return cipher.slice(0, offset * 2) + chunk.slice(offset * 2) + cipher.slice((offset + newText.length) * 2);
}

export function attack(cipher: string) {
    const cipherBytes = hex2bytes(cipher);
    const newText = 'A'.repeat(cipherBytes.length);
    const newTextBytes = str2bytes(newText);
    const encryptedBytes = hex2bytes(edit(cipher, 0, newText));
    return new TextDecoder().decode(Uint8Array.from(encryptedBytes.map((i, j) => i ^ newTextBytes[j] ^ cipherBytes[j])));
}
