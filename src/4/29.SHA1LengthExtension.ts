import { sha1KeyedMAC } from 'set4/28.SHA1';
import { chunkArray } from 'utils/chunkArray';
import { bytes2str, hex2bytes } from 'utils/converter';
import { SHA1 } from 'utils/sha1';
import { concatUint8 } from 'utils/uint';

function digest(message: string, prevHash: string, prevLength: number) {
    class FakeSHA1 extends SHA1 {

        h = chunkArray(hex2bytes(prevHash), 4).map(concatUint8);

        pad(msg: string) {
            const padded = super.pad(msg);
            let quotient = (msg.length + prevLength) * 8;
            let index = padded.length - 1;
            for (; quotient >= 256; quotient = ~~(quotient / 256), index--) {
                padded[index] = quotient % 256;
            }
            padded[index] = quotient;
            return padded;
        }
    }

    return new FakeSHA1().digest(message);
}

export function lengthExtension(key: string, newMessage: string) {
    const originalMessage = 'comment1=cooking%20MCs;userdata=foo;comment2=%20like%20a%20pound%20of%20bacon';
    const padded = bytes2str(new SHA1().pad('\0'.repeat(key.length) + originalMessage));
    const originalHash = sha1KeyedMAC(key, originalMessage);
    const newHash = digest(newMessage, originalHash, padded.length);
    return {
        hash: newHash,
        message: padded.slice(key.length) + newMessage
    };
}
