import { hack } from 'set3/17.paddingOracle';

describe('Set 3 Challenge 17', () => {
    it('should produce right answer', (done) => {
        const { decrypted, origin } = hack();
        expect(decrypted).toBe(origin);
        done();
    });
});
