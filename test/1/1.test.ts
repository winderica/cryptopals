import { hex2base64 } from 'set1/1.hex2base64';

describe('Set 1 Challenge 1', () => {
    it('should produce right answer', (done) => {
        const str = '49276d206b696c6c696e6720796f757220627261696e206c696b65206120706f69736f6e6f7573206d757368726f6f6d';
        const answer = 'SSdtIGtpbGxpbmcgeW91ciBicmFpbiBsaWtlIGEgcG9pc29ub3VzIG11c2hyb29t';
        expect(hex2base64(str)).toBe(answer);
        done();
    })
});
