export const bytes2hex = (bytes: number[] | Uint8Array) => [...bytes].map((i) => i.toString(16).padStart(2, '0')).join('');
export const hex2bytes = (hex: string) => hex.match(/.{2}/g)!.map((i) => parseInt(i, 16));
export const str2bytes = (str: string) => [...str].map((i) => i.charCodeAt(0));
export const bytes2str = (bytes: number[] | Uint8Array) => String.fromCharCode(...bytes);
export const hex2str = (hex: string) => String.fromCharCode(...hex.match(/.{2}/g)!.map((i) => parseInt(i, 16)));
export const num2hex = (n: number, length: number) => n.toString(16).padStart(length, '0');
