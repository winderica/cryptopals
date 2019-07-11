import { padPKCS7 } from 'set2/9.pkcs7';

describe('Set 2 Challenge 9', () => {
    it('should produce right answer', (done) => {
        const str = 'YELLOW SUBMARINE';
        const answer = 'YELLOW SUBMARINE\x04\x04\x04\x04';
        expect(new TextDecoder().decode(padPKCS7(new TextEncoder().encode(str), 20))).toBe(answer);
        done();
    });
});
