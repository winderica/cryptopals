import { SimpleAES } from 'utils/simpleAES';

function counter(index: number, nonce: Uint8Array) {
    const indexArray = index
        .toString(16)
        .padStart(16, '0')
        .match(/.{2}/g)!
        .reverse()
        .map((i) => parseInt(i, 16));
    nonce = nonce.slice(0, 8).reverse();
    return Uint8Array.from([...nonce, ...indexArray]);
}

export function decrypt(cipher: string, key: string, iv: string) {
    return new SimpleAES('aes-128-ctr', key, iv)
        .decrypt(cipher, 'base64', 'ascii', counter);
}
