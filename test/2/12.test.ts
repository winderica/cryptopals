import { byteAtATime, unknownString } from 'set2/12.ECBByteAtATime';

describe('Set 2 Challenge 12', () => {
    it('should produce right answer', (done) => {
        const decrypted = byteAtATime();
        expect(decrypted).toBe(unknownString);
        done();
    });
});
