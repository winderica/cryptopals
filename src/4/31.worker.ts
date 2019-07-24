import { checkHash, delay } from 'set4/31.server';
import { bytes2hex } from 'utils/converter';
import { parentPort, workerData } from 'worker_threads';

interface WorkerData {
    file: string;
    start: number;
    end: number;
}

function attack({ start, end, file }: WorkerData) {

    parentPort!.on('message', async ({ hash, index }: { hash: Uint8Array, index: number }) => {
        for (let i = start; i < end; i++) {
            hash[index] = i;
            const before = Date.now();
            await checkHash(file, bytes2hex(hash));
            const after = Date.now();
            if (after - before >= delay * (index + 1)) {
                parentPort!.postMessage(i);
                return;
            }
        }
        parentPort!.postMessage(-1);
    });
}

attack(workerData);
