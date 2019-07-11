import { detect } from 'set2/11.detectMode';

describe('Set 2 Challenge 11', () => {
    it('should produce right answer', (done) => {
        const { mode, guess } = detect();
        expect(guess).toBe(mode);
        done();
    });
});
