import { lengthExtension } from 'set4/29.SHA1LengthExtension';
import { randomString } from 'utils/random';
import { SHA1 } from 'utils/sha1';

describe('Set 4 Challenge 29', () => {
    it('should produce right answer', (done) => {
        const key = randomString();
        const newMessage = ';admin=true';
        const { message, hash } = lengthExtension(key, newMessage);
        expect(hash).toBe(new SHA1().digest(key + message));
        expect(message).toContain(newMessage);
        done();
    });
});
