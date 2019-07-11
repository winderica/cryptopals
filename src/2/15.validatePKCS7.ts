export function validatePKCS7(arr: Uint8Array) {
    if (arr.length % 16) {
        return false;
    }
    const padLength = arr[arr.length - 1];
    if (padLength < 1 || padLength > 16) {
        return false;
    }
    let i = 0;
    while (i < padLength) {
        if (arr[arr.length - 1 - i] !== padLength) {
            return false;
        }
        i++;
    }
    return true;
}
