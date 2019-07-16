import { fixedNonce } from 'set3/19.CTRFixedNonce';

describe('Set 3 Challenge 19', () => {
    it('should produce right answer', (done) => {
        console.log(fixedNonce());
        done();
    });
});
