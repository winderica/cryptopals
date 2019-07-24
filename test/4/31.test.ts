import { createHmac } from 'crypto';
import { attackAsync } from 'set4/31.HMAC-SHA1';
import { checkHash } from 'set4/31.server';
import { hmac } from 'utils/hmac';
import { randomString } from 'utils/random';
import { SHA1 } from 'utils/sha1';

describe('Set 4 Challenge 31', () => {
    it('should produce right answer', async (done) => {
        const file = randomString();
        const key = randomString();
        expect(hmac(key, file, SHA1)).toBe(createHmac('sha1', key).update(file, 'ascii').digest('hex'));
        const hash = await attackAsync(file);
        expect(await checkHash(file, hash)).toBe(200);
        done();
    }, 0x7fffffff);
});
