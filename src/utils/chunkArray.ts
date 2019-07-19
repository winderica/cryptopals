export function chunkArray(arr: number[] | Uint8Array, chunkSize: number) {
    return [...new Array(Math.ceil(arr.length / chunkSize))].map((i, j) =>
        Uint8Array.from(arr.slice(j * chunkSize, (j + 1) * chunkSize))
    );
}
