import { SimpleAES } from './utils/simpleAES';

const aes = new SimpleAES('', 'YELLOW SUBMARINE', '');
const encrypted = aes.encrypt('YELLOW SUBMARINE', 'ascii', 'base64');
console.log(encrypted);
const decrypted = aes.decrypt(encrypted, 'base64', 'ascii');
console.log(decrypted);
