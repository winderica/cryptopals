import { attack, key } from 'set4/27.CBCKeyEqualsIV';

describe('Set 4 Challenge 27', () => {
    it('should produce right answer', (done) => {
        expect(attack()).toBe(key);
        done();
    });
});
