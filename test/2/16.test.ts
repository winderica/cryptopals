import { bitFlipping } from 'set2/16.CBCBitFlipping';

describe('Set 2 Challenge 16', () => {
    it('should produce right answer', (done) => {
        expect(bitFlipping()).toContain(';admin=true;');
        done();
    });
});
