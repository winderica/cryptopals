import { SimpleAES } from 'utils/simpleAES';

export function decrypt(cipher: string, key: string, iv: string) {
    return new SimpleAES('aes-128-cbc', key, iv).decrypt(cipher, 'base64', 'ascii');
}
