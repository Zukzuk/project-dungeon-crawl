

/** as copied from https://gist.github.com/blixt/f17b47c62508be59987b **/
/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
window.PRNG = function (seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
window.PRNG.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};


/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
window.PRNG.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

/******************************************************************************/

class RandomWalker {
  constructor(width, height, seed = Math.floor(Math.random() * 2**32)) {
    this.gridWidth = width;
    this.gridHeight = height;
    this.grid = this.generateGrid(width, height);
    this.cursor = [width/2, height/2];
    this.seed = seed;
    const prng = new PRNG(seed);
    this.rnd = prng.next.bind(prng);
    //this.rnd = new PRNG(seed);
  }
  generateGrid(width, height, value = 0) {
    const rowTempl = Array.apply(null, Array(width)).map( () => value );
    return Array.apply(null, Array(height)).map( () => rowTempl.slice() );
  }
  step() {
    const cursor = this.cursor;
    const maxCursorX = this.gridWidth -1;
    const maxCursorY = this.gridHeight -1;
    // north = 0, west = 1, south = 2, east = 3
    let direction = this.rnd() % 4;
    cursor[0] = Math.max(Math.min(cursor[0] + (direction - 2) % 2, maxCursorX), 0);
    cursor[1] = Math.max(Math.min(cursor[1] + (direction - 1) % 2, maxCursorY), 0);
    this.grid[cursor[1]][cursor[0]] = 1;
  }
  walk(numTiles = this.gridWidth * this.gridHeight) {
    const cursor = this.cursor;
    const grid = this.grid;
    const rnd = this.rnd;
    const maxCursorX = this.gridWidth -1;
    const maxCursorY = this.gridHeight -1;
    for(let i=0; i < numTiles; i++) {
      // north = 0, west = 1, south = 2, east = 3
      let direction = rnd() % 4;
      cursor[0] = Math.max(Math.min(cursor[0] + (direction - 2) % 2, maxCursorX), 0);
      cursor[1] = Math.max(Math.min(cursor[1] + (direction - 1) % 2, maxCursorY), 0);
      grid[cursor[1]][cursor[0]] = 1;
    }
  }
}
