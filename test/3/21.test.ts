import { MT19937 } from 'set3/21.MT19937';

describe('Set 3 Challenge 21', () => {
    it('should produce right answer', (done) => {
        const mt = new MT19937(1);
        [...new Array(10)].forEach(() => console.log(mt.extractNumber()));
        done();
    });
});
