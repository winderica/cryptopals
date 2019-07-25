import { checkHash } from 'set4/31.server';
import { bytes2hex } from 'utils/converter';
import { parentPort, workerData } from 'worker_threads';

interface WorkerData {
    file: string;
    start: number;
    end: number;
    delay: number;
}

function attack({ start, end, file, delay }: WorkerData) {

    parentPort!.on('message', async ({ hash, index }: { hash: Uint8Array, index: number }) => {
        const threshold = delay * (index + 1) + Math.max(0, index - delay / 3);
        for (let i = start; i < end; i++) {
            hash[index] = i;
            const before = Date.now();
            await checkHash(file, bytes2hex(hash), delay);
            const after = Date.now();
            if (after - before >= threshold) {
                parentPort!.postMessage(i);
                return;
            }
        }
        parentPort!.postMessage(-1);
    });
}

attack(workerData);
