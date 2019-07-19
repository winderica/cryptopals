import { SHA1 } from 'utils/sha1';

export function sha1KeyedMAC(key: string, message: string) {
    return new SHA1().digest(key + message);
}
