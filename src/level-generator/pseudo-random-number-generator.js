/***** copied from https://gist.github.com/blixt/f17b47c62508be59987b *****/
/***** modded into an ES6 class *****/
/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */

export default class PRNG {
  constructor(seed = Math.floor(Math.random() * Math.pow(2, 32))) {
    this.seed = seed % 2147483647;
    if (this.seed <= 0)
      this._seed += 2147483646;
  }
  next() {
    return this.seed = this.seed * 16807 % 2147483647;
  }
  nextBetween(x,y) {
    // assumes x > y
    return this.next() % (y-x+1) + x;
  }
  /**
   * Returns a pseudo-random floating point number in range [0, 1).
   */
  nextFloat(opt_minOrMax, opt_max) {
    // We know that result of next() will be 1 to 2147483646 (inclusive).
    return (this.next() - 1) / 2147483646;
  }
}
