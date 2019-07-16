import { MT19937 } from 'utils/mt19937';
import { randomInt } from 'utils/random';

const now = +new Date();
const time = now - randomInt(1000);
const random = new MT19937(time).extractNumber();

export function crack() {
    for (let i = now - 1000; i <= now; i++) {
        if (new MT19937(i).extractNumber() === random) {
            return { origin: time, cracked: i };
        }
    }
    throw new Error('Failed to crack');
}
