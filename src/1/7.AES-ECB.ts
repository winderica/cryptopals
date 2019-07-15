import { SimpleAES } from 'utils/simpleAES';

export function decrypt(cipher: string, key: string) {
    return new SimpleAES('aes-128-ecb', key).decrypt(cipher, 'base64', 'ascii');
}
