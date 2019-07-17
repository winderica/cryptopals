export class MT19937 {
    /*
     * w: word size (in number of bits)
     * n: degree of recurrence
     * m: middle word, an offset used in the recurrence relation defining the series x, 1 ≤ m < n
     * r: separation point of one word, or the number of bits of the lower bitmask, 0 ≤ r ≤ w - 1
     * a: coefficients of the rational normal form twist matrix
     * b, c: TGFSR(R) tempering bitmasks
     * s, t: TGFSR(R) tempering bit shifts
     * u, d, l: additional Mersenne Twister tempering bit shifts/masks
     */
    private readonly w = 32;
    private readonly n = 624;
    private readonly m = 397;
    private readonly r = 31;
    private readonly a = 0x9908b0df;
    private readonly u = 11;
    private readonly d = 0xffffffff;
    private readonly s = 7;
    private readonly b = 0x9d2c5680;
    private readonly t = 15;
    private readonly c = 0xefc60000;
    private readonly l = 18;
    private readonly f = 0x6c078965n;
    private readonly x = new Uint32Array(this.n);
    private readonly lowerMask = (1 << this.r) - 1;
    private readonly upperMask = 1 << this.r;
    private index = this.n;

    constructor(seed: number | Uint32Array) {
        if (typeof seed === 'number') {
            this.initialize(seed);
        } else {
            this.x = seed;
        }
    }

    getState() {
        return [...this.x];
    }

    extractNumber() {
        if (this.index > this.n) {
            throw new Error('Generator was never seeded');
        } else if (this.index === this.n) {
            this.twist();
        }
        let y = this.x[this.index++];
        y ^= (y >>> this.u) & this.d;
        y ^= (y << this.s) & this.b;
        y ^= (y << this.t) & this.c;
        y ^= y >>> this.l;
        return y >>> 0;
    }

    private initialize(seed: number) {
        this.x[0] = seed;
        for (let i = 1; i < this.n; i++) {
            this.x[i] = Number(BigInt(this.x[i - 1] ^ (this.x[i - 1] >>> (this.w - 2))) * this.f & 0xfffffffffffn) + i;
        }
    }

    private twist() {
        for (let i = 0; i < this.n; i++) {
            const X = (this.x[i] & this.upperMask) + (this.x[(i + 1) % this.n] & this.lowerMask);
            this.x[i] = this.x[(i + this.m) % this.n] ^ (X % 2 ? (X >>> 1) ^ this.a : X >>> 1);
        }
        this.index = 0;
    }
}
