import { fixedXOR } from 'set1/2.fixedXOR';

describe('Set 1 Challenge 2', () => {
    it('should produce right answer', (done) => {
        const str1 = '1c0111001f010100061a024b53535009181c';
        const str2 = '686974207468652062756c6c277320657965';
        const answer = '746865206b696420646f6e277420706c6179';
        expect(fixedXOR(str1, str2)).toBe(answer);
        done();
    })
});
