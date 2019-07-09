import { readFileSync } from 'fs';
import { detect } from 'set1/8.AES-ECB';

describe('Set 1 Challenge 8', () => {
    it('should produce right answer', (done) => {
        const buffer = readFileSync(__dirname + '/8.txt');
        const ciphers = buffer.toString().split('\n');
        console.log(`encrypted with ECB: ${detect(ciphers)}`);
        done();
    });
});
