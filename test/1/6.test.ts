import { readFileSync } from 'fs';
import { decrypt } from 'set1/6.multiKeyXOR';

describe('Set 1 Challenge 6', () => {
    it('should produce right answer', (done) => {
        const buffer = readFileSync(__dirname + '/6.txt');
        const { plaintext, key } = decrypt(buffer);
        console.log(`plaintext: ${plaintext}\nkey: ${key}`);
        done();
    });
});
