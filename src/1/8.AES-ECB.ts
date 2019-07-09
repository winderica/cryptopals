export function detect(arr: string[]) {
    return arr.map((i) => i.match(/.{16}/g)).filter((i) => i && new Set(i).size !== i.length)[0]!.join('');
}
