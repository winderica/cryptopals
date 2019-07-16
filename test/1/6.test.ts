import { readFileSync } from 'fs';
import { base64DecodeAsCharCode } from 'set1/1.hex2base64';
import { decrypt } from 'set1/6.multiKeyXOR';

describe('Set 1 Challenge 6', () => {
    it('should produce right answer', (done) => {
        const buffer = readFileSync('src/assets/6.txt');
        const bytes = [...base64DecodeAsCharCode(buffer.toString().split('\n').join(''))];
        const { plaintext, key } = decrypt(bytes.map((i) => String.fromCharCode(i)).join(''));
        console.log(`plaintext: ${plaintext}\nkey: ${key}`);
        done();
    });
});
