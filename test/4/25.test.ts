import { readFileSync } from 'fs';
import { base64Decode } from 'set1/1.hex2base64';
import { attack, key, nonce } from 'set4/25.CTRRandomAccess';
import { SimpleAES } from 'utils/simpleAES';

describe('Set 4 Challenge 25', () => {
    it('should produce right answer', (done) => {
        const plaintext = base64Decode(readFileSync('src/assets/25.txt').toString().split('\n').join(''));
        const cipher = new SimpleAES('aes-128-ctr', key, nonce).encrypt(plaintext, 'utf-8', 'hex');
        expect(attack(cipher)).toBe(plaintext);
        done();
    });
});
