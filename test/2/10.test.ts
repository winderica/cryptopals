import { readFileSync } from 'fs';
import { decrypt } from 'set2/10.AES-CBC';

describe('Set 2 Challenge 10', () => {
    it('should produce right answer', (done) => {
        const buffer = readFileSync('src/assets/10.txt');
        const cipher = buffer.toString().split('\n').join('');
        const key = 'YELLOW SUBMARINE';
        const iv = '\x00'.repeat(16);
        console.log(`plaintext: ${decrypt(cipher, key, iv)}`);
        done();
    });
});
