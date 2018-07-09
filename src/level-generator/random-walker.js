import Grid from './grid';

/***** as copied from https://gist.github.com/blixt/f17b47c62508be59987b *****/
/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller PRNG.
 * http://www.firstpr.com.au/dsp/rand31/
 */
window.PRNG = function (seed) {
  this._seed = seed % 2147483647;
  if (this._seed <= 0) this._seed += 2147483646;
};

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
  constructor(width, height, seed = Math.floor(Math.random() * Math.pow(2, 32)), maxSteps=undefined) {
    this.gridWidth = width;
    this.gridHeight = height;
    this.grid = new Grid(width, height);
    this.cursor = [Math.floor(width/2), Math.floor(height/2)];
    this.seed = seed;
    const prng = new window.PRNG(seed);
    this.rnd = prng.next.bind(prng);
    this.steps = 0;
    this.maxSteps = maxSteps || width * height;
    //this.rnd = new PRNG(seed);
  }
  step() {
    const cursor = this.cursor;
    const grid = this.grid;
    const maxCursorX = grid.width() -1;
    const maxCursorY = grid.height() -1;
    // north = 0, west = 1, south = 2, east = 3
    let direction = this.rnd() % 4;
    cursor[0] = Math.max(Math.min(cursor[0] + (direction - 2) % 2, maxCursorX), 0);
    cursor[1] = Math.max(Math.min(cursor[1] + (direction - 1) % 2, maxCursorY), 0);
    grid.rawGrid[cursor[1]][cursor[0]] = 1;
    this.steps++;
  }
  walk(numTiles) {
    const cursor = this.cursor;
    const grid = this.grid;
    const rawGrid = grid.rawGrid;
    const rnd = this.rnd;
    const maxCursorX = grid.width() -1;
    const maxCursorY = grid.height() -1;
    const steps = ( numTiles ? numTiles : this.maxSteps - this.steps );
    for(let i=0; i < numTiles; i++) {
      // north = 0, west = 1, south = 2, east = 3
      let direction = rnd() % 4;
      cursor[0] = Math.max(Math.min(cursor[0] + (direction - 2) % 2, maxCursorX), 0);
      cursor[1] = Math.max(Math.min(cursor[1] + (direction - 1) % 2, maxCursorY), 0);
      rawGrid[cursor[1]][cursor[0]] = 1;
      this.steps++;
    }
  }
  isCompleted() {
    return this.steps >= this.maxSteps;
  }
  gridInfo() {
    const gridInfoValues = {};
    const grid = this.grid;
    const step = this.steps;
    gridInfoValues.step = step + " of " + this.maxSteps;
    gridInfoValues.gridSize = JSON.stringify([grid.width(), grid.height()]);
    gridInfoValues.seed = this.seed;
    gridInfoValues.levelSize = grid.sumGrid();
    gridInfoValues.efficiency = (gridInfoValues.levelSize/step).toFixed(2);
    return gridInfoValues;
  }
  generateDungeon() {
    this.walk();
  }
}

export { RandomWalker as default };
