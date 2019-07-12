import { randomBytes } from 'crypto';

export const randomString = (length = 16) => randomBytes(length * 100).toString('ascii').slice(0, length);
export const randomInt = (max: number) => ~~(Math.random() * max);
export const randomItem = <T>(array: T[]) => array[randomInt(array.length)];
