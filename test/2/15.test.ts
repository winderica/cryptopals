import { validatePKCS7 } from 'set2/15.validatePKCS7';

describe('Set 2 Challenge 15', () => {
    it('should produce right answer', (done) => {
        const str2Uint8Array = (str: string) => Uint8Array.from(str.split('').map((i) => i.charCodeAt(0)));
        expect(validatePKCS7(str2Uint8Array('ICE ICE BABY\x04\x04\x04\x04'))).toBe(true);
        expect(validatePKCS7(str2Uint8Array('ICE ICE BABY\x05\x05\x05\x05'))).toBe(false);
        expect(validatePKCS7(str2Uint8Array('ICE ICE BABY\x01\x02\x03\x04'))).toBe(false);
        done();
    });
});
