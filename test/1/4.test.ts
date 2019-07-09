import { readFileSync } from 'fs';
import { decrypt } from 'set1/4.xorCipher';

describe('Set 1 Challenge 4', () => {
    it('should produce right answer', (done) => {
        const buffer = readFileSync(__dirname + '/4.txt');
        const { plaintext, cipher, key } = decrypt(buffer);
        console.log(`cipher:${cipher}\nkey: ${String.fromCharCode(key)}\nplaintext: ${plaintext}`);
        done();
    });
});
