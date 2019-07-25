import { attackAsync, checkHash } from 'set4/32.HMAC-SHA1';
import { randomString } from 'utils/random';

describe('Set 4 Challenge 32', () => {
    it('should produce right answer', async (done) => {
        const file = randomString();
        const delay = 5;
        const hash = await attackAsync(file, delay);
        expect(await checkHash(file, hash, delay)).toBe(200);
        done();
    }, 0x7fffffff);
});
