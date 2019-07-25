import { attackAsync } from 'set4/31.HMAC-SHA1';
import { checkHash } from 'set4/31.server';
import { randomString } from 'utils/random';

describe('Set 4 Challenge 31', () => {
    it('should produce right answer', async (done) => {
        const file = randomString();
        const delay = 50;
        const hash = await attackAsync(file, delay);
        expect(await checkHash(file, hash, delay)).toBe(200);
        done();
    }, 0x7fffffff);
});
