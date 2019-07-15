import { randomString } from 'utils/random';
import { SimpleAES } from 'utils/simpleAES';

const key = randomString();

function parser(str: string) {
    return Object.fromEntries(str.split('&').map((i) => i.split('=')));
}

function generateProfile(email: string) {
    const profile = {
        email: email.replace(/[&=]/g, ''),
        uid: 10,
        role: 'user'
    };
    return encrypt(Object.entries(profile).map((i) => i.join('=')).join('&'));
}

function encrypt(plaintext: string) {
    return new SimpleAES('aes-128-ecb', key).encrypt(plaintext, 'ascii', 'hex');
}

function decrypt(cipher: string) {
    return new SimpleAES('aes-128-ecb', key).decrypt(cipher, 'hex', 'ascii');
}

export function cutAndPaste() {
    // email=1111111111 admin\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b @bar.com&uid=10& role=user
    const email1 = '1'.repeat(10) + 'admin' + '\x0b'.repeat(11) + '@bar.com';
    // email=foooo@bar. com&uid=10&role= user
    const email2 = 'foooo@bar.com';
    // email=foooo@bar. com&uid=10&role= admin\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b\x0b
    return parser(decrypt(generateProfile(email2).slice(0, 64) + generateProfile(email1).slice(32, 64)));
}
