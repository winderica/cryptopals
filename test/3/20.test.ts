import { readFileSync } from 'fs';
import { base64Decode } from 'set1/1.hex2base64';
import { fixedNonce } from 'set3/20.CTRFixedNonce';

describe('Set 3 Challenge 20', () => {
    it('should produce right answer', (done) => {
        const strings = readFileSync('src/assets/20.txt').toString().split('\n').filter((i) => i).map(base64Decode);
        console.log(fixedNonce(strings));
        done();
    });
});
