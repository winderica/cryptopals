import { paddingOracle } from 'set3/17.paddingOracle';

describe('Set 3 Challenge 17', () => {
    it('should produce right answer', (done) => {
        const { decrypted, origin } = paddingOracle();
        expect(decrypted).toBe(origin);
        done();
    });
});
