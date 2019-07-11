import { detect } from 'set2/11.detectMode';

describe('Set 2 Challenge 11', () => {
    it('should produce right answer', (done) => {
        [...new Array(1000)].map(() => {
            const { mode, guess } = detect();
            expect(guess).toBe(mode);
        });
        done();
    });
});
