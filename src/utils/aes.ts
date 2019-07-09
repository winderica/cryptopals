import crypto, { HexBase64BinaryEncoding, Utf8AsciiBinaryEncoding } from 'crypto';

export class AES {
    algorithm: string;
    key: string;
    iv: string;

    constructor(algorithm: string, key: string, iv = '') {
        this.algorithm = algorithm;
        this.key = key;
        this.iv = iv;
    }

    encrypt(message: string, messageEncoding = 'utf8' as Utf8AsciiBinaryEncoding, cipherEncoding = 'base64' as HexBase64BinaryEncoding) {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, this.iv);
        cipher.setAutoPadding(true);

        return cipher.update(message, messageEncoding, cipherEncoding) + cipher.final(cipherEncoding);
    }

    decrypt(encrypted: string, cipherEncoding = 'base64' as HexBase64BinaryEncoding, messageEncoding = 'utf8' as Utf8AsciiBinaryEncoding) {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, this.iv);
        decipher.setAutoPadding(true);

        return decipher.update(encrypted, cipherEncoding, messageEncoding) + decipher.final(messageEncoding);
    }
}
