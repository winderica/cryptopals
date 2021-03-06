import path from 'path';
import { checkHash } from 'set4/31.server';
import { promisify } from 'util';
import { bytes2hex } from 'utils/converter';
import { Worker } from 'worker_threads';

const getMessage = (worker: Worker) => promisify(
    (cb) => worker.once('message', (res) => cb(null, res))
)();

export async function attackAsync(file: string, delay: number) {
    const workerFile = process.env.NODE_ENV === 'production' ? './31.worker.js' : './31.workerImporter.js';

    const threads = 32;
    const workers = [...new Array(threads)].map((i, j) => new Worker(path.resolve(__dirname, workerFile), {
        workerData: {
            file,
            start: j * 256 / threads,
            end: (j + 1) * 256 / threads,
            delay
        }
    }));

    const hash = new Uint8Array(20);
    let index = 0;
    while (index < 20) {
        const values = await Promise.all(workers.map(async (worker) => {
            worker.postMessage({ index, hash });
            return await getMessage(worker) as number;
        }));
        const value = values.filter((i) => i !== -1)[0];
        if (value !== undefined) {
            hash[index] = value;
            index++;
        } else {
            index--;
        }
        if (index === 20) {
            if (await checkHash(file, bytes2hex(hash), delay) !== 200) {
                index--;
            }
        }
        console.log(bytes2hex(hash));
    }
    return bytes2hex(hash);
}
