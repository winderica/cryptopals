import { clone } from 'set3/23.MT19937';
import { MT19937 } from 'utils/mt19937';

describe('Set 3 Challenge 23', () => {
    it('should produce right answer', (done) => {
        const mt = new MT19937(1234);
        const randoms = [...new Array(624)].map(() => mt.extractNumber());
        const state = mt.getState();
        expect(state).toEqual(clone(randoms));
        done();
    });
});
