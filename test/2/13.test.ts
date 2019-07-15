import { cutAndPaste } from 'set2/13.ECBCutAndPaste';

describe('Set 2 Challenge 13', () => {
    it('should produce right answer', (done) => {
        const { role } = cutAndPaste();
        expect(role).toBe('admin');
        done();
    });
});
