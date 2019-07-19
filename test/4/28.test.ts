import { sha1KeyedMAC } from 'set4/28.SHA1';
import { randomString } from 'utils/random';

describe('Set 4 Challenge 28', () => {
    it('should produce right answer', (done) => {
        const key = randomString();
        const message = randomString(100000);
        console.log(sha1KeyedMAC(key, message));
        done();
    });
});
