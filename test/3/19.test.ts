import { readFileSync } from 'fs';
import { base64Decode } from 'set1/1.hex2base64';
import { fixedNonce } from 'set3/19.CTRFixedNonce';

describe('Set 3 Challenge 19', () => {
    it('should produce right answer', (done) => {
        const strings = readFileSync('src/assets/19.txt').toString().split('\n').filter((i) => i).map(base64Decode);
        console.log(fixedNonce(strings));
        done();
    });
});
