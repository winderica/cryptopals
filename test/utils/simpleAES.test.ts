import { AES } from 'utils/aes';
import { randomString } from 'utils/random';
import { Algorithm, SimpleAES } from 'utils/simpleAES';

const testAES = (algorithm: Algorithm) => (done: jest.DoneCallback) => {
    const plaintext = randomString(65536);
    const key = randomString(+algorithm.split('-')[1] / 8);
    const iv = randomString();
    const cipher1 = new SimpleAES(algorithm, key, iv).encrypt(plaintext);
    const cipher2 = new AES(algorithm, key, algorithm.includes('ecb') ? undefined : iv).encrypt(plaintext);
    expect(cipher1).toBe(cipher2);
    const plaintext1 = new SimpleAES(algorithm, key, iv).decrypt(cipher1);
    const plaintext2 = new AES(algorithm, key, algorithm.includes('ecb') ? undefined : iv).decrypt(cipher2);
    expect(plaintext1).toBe(plaintext2);
    expect(plaintext1).toBe(plaintext);
    done();
};

describe('Simple AES', () => {
    it('aes-128-ecb', testAES('aes-128-ecb'));
    it('aes-192-ecb', testAES('aes-192-ecb'));
    it('aes-256-ecb', testAES('aes-256-ecb'));
    it('aes-128-cbc', testAES('aes-128-cbc'));
    it('aes-192-cbc', testAES('aes-192-cbc'));
    it('aes-256-cbc', testAES('aes-256-cbc'));
    it('aes-128-ctr', testAES('aes-128-ctr'));
    it('aes-192-ctr', testAES('aes-192-ctr'));
    it('aes-256-ctr', testAES('aes-256-ctr'));
});
