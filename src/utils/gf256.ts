export class GF256 {
    static reducingP = 0b100011011; // x^8 + x^4 + x^3 + x + 1

    static multiply(x: number, y: number) {
        let product = 0;
        while (y) {
            (y % 2) && (product ^= x);
            x <<= 1;
            y >>= 1;
        }
        return this.divide(product, this.reducingP).r;
    }

    static divide(dividend: number, divisor: number) {
        let dividendSize = this.size(dividend);
        const divisorSize = this.size(divisor);
        let quotient = 0;
        while (dividendSize >= divisorSize) {
            dividend ^= divisor << dividendSize - divisorSize;
            quotient ^= 1 << dividendSize - divisorSize;
            dividendSize = this.size(dividend);
        }
        return { q: quotient, r: dividend };
    }

    static inverse(x: number) {
        let r0 = 1;
        let r1 = 0;
        let t0 = 0;
        let t1 = 1;
        let x0 = this.reducingP;
        while (x) {
            const { q, r } = this.divide(x0, x);
            [x0, x] = [x, r];
            [t0, t1] = [t1, t0 ^ this.multiply(q, t1)];
            [r0, r1] = [r1, r0 ^ this.multiply(q, r1)];
        }
        return t0;
    }

    private static size(x: number) {
        let result = 0;
        while (x) {
            result++;
            x >>= 1;
        }
        return result;
    }
}
