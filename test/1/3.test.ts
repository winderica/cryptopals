import { decrypt } from 'set1/3.xorCipher';

describe('Set 1 Challenge 3', () => {
    it('should produce right answer', (done) => {
        const cipher = '1b37373331363f78151b7f2b783431333d78397828372d363c78373e783a393b3736';
        const { plaintext, key } = decrypt(cipher);
        console.log(`plaintext: ${plaintext}\nkey: ${String.fromCharCode(key)}`);
        done();
    })
});
