import { crack } from 'set3/22.MT19937';

describe('Set 3 Challenge 22', () => {
    it('should produce right answer', (done) => {
        const { cracked, origin } = crack();
        expect(cracked).toBe(origin);
        done();
    });
});
