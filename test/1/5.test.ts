import { multiKeyXOR } from 'set1/5.mutilKeyXOR';

describe('Set 1 Challenge 5', () => {
    it('should produce right answer', (done) => {
        const plaintext = 'Burning \'em, if you ain\'t quick and nimble\nI go crazy when I hear a cymbal';
        const key = 'ICE';
        const cipher = '0b3637272a2b2e63622c2e69692a23693a2a3c6324202d623d63343c2a26226324272765272a282b2' +
            'f20430a652e2c652a3124333a653e2b2027630c692b20283165286326302e27282f';
        expect(multiKeyXOR(plaintext, key)).toBe(cipher);
        done();
    });
});
