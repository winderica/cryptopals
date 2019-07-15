import { validatePKCS7 } from 'set2/15.validatePKCS7';
import { str2bytes } from 'utils/converter';

describe('Set 2 Challenge 15', () => {
    it('should produce right answer', (done) => {
        const str2Uint8Array = (str: string) => Uint8Array.from(str2bytes(str));
        expect(validatePKCS7(str2Uint8Array('ICE ICE BABY\x04\x04\x04\x04'))).toBe(true);
        expect(validatePKCS7(str2Uint8Array('ICE ICE BABY\x05\x05\x05\x05'))).toBe(false);
        expect(validatePKCS7(str2Uint8Array('ICE ICE BABY\x01\x02\x03\x04'))).toBe(false);
        done();
    });
});
