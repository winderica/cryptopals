import { attack, checkToken, decrypt, encrypt, generateToken } from 'set3/24.MT19937';
import { randomInt, randomString } from 'utils/random';

describe('Set 3 Challenge 24', () => {
    const partial = 'A'.repeat(14);
    const plaintext = randomString(2) + partial;
    const cipher = encrypt(plaintext);
    it('should return original string after encrypt and decrypt', (done) => {
        expect(decrypt(cipher)).toBe(plaintext);
        done();
    });
    it('should brute force the plaintext successfully', (done) => {
        expect(attack(cipher, partial)).toBe(plaintext);
        done();
    });
    it('should brute force the seed successfully', (done) => {
        const time = +new Date() - randomInt(60000);
        const token = generateToken(time);
        expect(checkToken(token)).toBe(time);
        done();
    });
});
