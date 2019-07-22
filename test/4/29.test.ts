import { lengthExtension } from 'set4/29.SHA1LengthExtension';
import { SHA1 } from 'utils/sha1';

describe('Set 4 Challenge 29', () => {
    it('should produce right answer', (done) => {
        const key = '1'.repeat(16);
        const newMessage = ';admin=true';
        const { message, hash } = lengthExtension(key, newMessage);
        expect(hash).toBe(new SHA1().digest(key + message));
        expect(message).toContain(newMessage);
        done();
    });
});
