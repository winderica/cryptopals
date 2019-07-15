import { decrypt } from 'set3/18.AES-CTR';

describe('Set 3 Challenge 18', () => {
    it('should produce right answer', (done) => {
        const cipher = 'L77na/nrFsKvynd6HzOoG7GHTLXsTVu9qvY/2syLXzhPweyyMTJULu/6/kXX0KSvoOLSFQ==';
        const key = 'YELLOW SUBMARINE';
        const iv = '\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00\x00';
        console.log(decrypt(cipher, key, iv));
        done();
    });
});
