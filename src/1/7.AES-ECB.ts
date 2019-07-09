import { AES } from '../utils/aes';

export function decrypt(cipher: string, key: string) {
    return new AES('aes-128-ecb', key).decrypt(cipher);
}
