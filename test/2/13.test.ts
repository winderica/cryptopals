import { hack } from 'set2/13.ECBCutAndPaste';

describe('Set 2 Challenge 13', () => {
    it('should produce right answer', (done) => {
        const { role } = hack();
        expect(role).toBe('admin');
        done();
    });
});
