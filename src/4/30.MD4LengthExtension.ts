import { chunkArray } from 'utils/chunkArray';
import { bytes2str, hex2bytes, num2hex, str2bytes } from 'utils/converter';
import { MD4 } from 'utils/md4';
import { concatUint8 } from 'utils/uint';

function digest(message: string, prevHash: string, prevLength: number) {
    class FakeMD4 extends MD4 {

        iv = chunkArray(hex2bytes(prevHash), 4).map((i) => i.reverse()).map(concatUint8);

        pad(msg: string) {
            const l0 = message.length;
            const l1 = ~~((l0 - 56) / 64 + 2) * 64;
            const padded = new Uint8Array(l1);
            str2bytes(message + '\x80' + '\x00'.repeat(l1 - 9 - l0))
                .concat(hex2bytes(num2hex((l0 + prevLength) * 8, 16)).reverse())
                .forEach((i, j) => padded[~~(j / 4) * 4 + 3 - j % 4] = i);
            return padded;
        }
    }

    return new FakeMD4().digest(message);
}

export function lengthExtension(key: string, newMessage: string) {
    const originalMessage = 'comment1=cooking%20MCs;userdata=foo;comment2=%20like%20a%20pound%20of%20bacon';
    const l0 = originalMessage.length + key.length;
    const l1 = ~~((l0 - 56) / 64 + 2) * 64;
    const padded = originalMessage + '\x80' + '\x00'.repeat(l1 - 9 - l0) + bytes2str(hex2bytes(num2hex(l0 * 8, 16)).reverse());
    const originalHash = new MD4().digest(key + originalMessage);
    const newHash = digest(newMessage, originalHash, l1);
    return {
        hash: newHash,
        message: padded + newMessage
    };
}
