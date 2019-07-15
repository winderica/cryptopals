import { readFileSync } from 'fs';
import { decrypt } from 'set1/7.AES-ECB';

describe('Set 1 Challenge 7', () => {
    it('should produce right answer', (done) => {
        const buffer = readFileSync('src/assets/7.txt');
        const cipher = buffer.toString().split('\n').join('');
        const key = 'YELLOW SUBMARINE';
        console.log(`plaintext: ${decrypt(cipher, key)}`);
        done();
    });
});
