import { decryptBlock } from 'set1/6.multiKeyXOR';
import { bytes2str, hex2bytes } from 'utils/converter';
import { randomString } from 'utils/random';
import { SimpleAES } from 'utils/simpleAES';

function encrypt(strings: string[]) {
    const key = randomString();
    const nonce = '\x00'.repeat(16);
    return strings.map((str) => new SimpleAES('aes-128-ctr', key, nonce).encrypt(str, 'ascii', 'hex'));
}

export function fixedNonce(strings: string[]) {
    const ciphers = encrypt(strings);
    const { plaintext } = decryptBlock(ciphers.map((i) => bytes2str(hex2bytes(i))));
    return plaintext;
}
