import { bitFlipping } from 'set4/26.CTRBitFlipping';

describe('Set 4 Challenge 26', () => {
    it('should produce right answer', (done) => {
        expect(bitFlipping()).toContain(';admin=true;');
        done();
    });
});
