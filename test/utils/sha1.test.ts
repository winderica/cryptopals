import { createHash } from 'crypto';
import { randomString } from 'utils/random';
import { SHA1 } from 'utils/sha1';

describe('Simple SHA1', () => {
    it('should produce right answer', (done) => {
        const message = randomString(100000);
        expect(new SHA1().digest(message)).toBe(createHash('sha1').update(message).digest('hex'));
        done();
    });
});
