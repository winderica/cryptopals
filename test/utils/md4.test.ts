import { createHash } from 'crypto';
import { MD4 } from 'utils/md4';
import { randomString } from 'utils/random';

describe('Simple MD4', () => {
    it('should produce right answer', (done) => {
        const message = randomString(10000);
        const md4 = new MD4();
        expect(md4.digest(message)).toBe(createHash('md4').update(message, 'ascii').digest('hex'));
        expect(md4.digest(message)).toBe(createHash('md4').update(message, 'ascii').digest('hex'));
        done();
    });
});
