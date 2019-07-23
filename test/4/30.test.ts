import { lengthExtension } from 'set4/30.MD4LengthExtension';
import { MD4 } from 'utils/md4';
import { randomString } from 'utils/random';

describe('Set 4 Challenge 30', () => {
    it('should produce right answer', (done) => {
        const key = randomString();
        const newMessage = ';admin=true';
        const { message, hash } = lengthExtension(key, newMessage);
        expect(hash).toBe(new MD4().digest(key + message));
        expect(message).toContain(newMessage);
        done();
    });
});
