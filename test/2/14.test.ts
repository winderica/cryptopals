import { byteAtATime, unknownString } from 'set2/14.ECBByteAtATime';

describe('Set 2 Challenge 14', () => {
    it('should produce right answer', (done) => {
        expect(byteAtATime()).toBe(unknownString);
        done();
    });
});
