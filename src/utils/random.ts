import { randomBytes } from 'crypto';

export const randomString = (length = 16) => randomBytes(length * 100).toString('ascii').slice(0, length);
