import { createHmac } from 'crypto';
import { hmac } from 'utils/hmac';
import { MD4 } from 'utils/md4';
import { randomString } from 'utils/random';
import { SHA1 } from 'utils/sha1';

describe('Simple HMAC', () => {
    it('should produce right answer', (done) => {
        const message = randomString();
        const key = randomString();
        expect(hmac(key, message, SHA1)).toBe(createHmac('sha1', key).update(message, 'ascii').digest('hex'));
        expect(hmac(key, message, MD4)).toBe(createHmac('md4', key).update(message, 'ascii').digest('hex'));
        done();
    });
});
