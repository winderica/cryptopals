import { createHash } from 'crypto';
import { randomString } from 'utils/random';
import { SHA1 } from 'utils/sha1';

describe('Simple SHA1', () => {
    it('should produce right answer', (done) => {
        const message = randomString(100000);
        const sha = new SHA1();
        expect(sha.digest(message)).toBe(createHash('sha1').update(message, 'ascii').digest('hex'));
        expect(sha.digest(message)).toBe(createHash('sha1').update(message, 'ascii').digest('hex'));
        done();
    });
});
