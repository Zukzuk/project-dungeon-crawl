
import PRNG from './pseudo-random-number-generator.js';

export default class Level {
  constructor(tileParams, spawnParams, seed = Math.floor(Math.random() * Math.pow(2, 32))) {
    this.seed = seed;
    this.tileParams = tileParams;
    this.spawnParams = spawnParams;
    this.tiles = this.initialize_tiles(tileParams, seed);
    this.spawns = undefined;
  }

  initialize_tiles({width = 100, height = 50, maxSteps = width * height, showGridValues = false, algorithm}, seed) {
    if( algorithm === undefined ) throw('Required parameter algorithm undefined');
    //console.log(algorithm);
    return new algorithm(width, height, seed);
  }
  initialize_spawns({spawns, grid, algorithm}, seed) {
    if( spawns === undefined ) throw('Required parameter "spawns" undefined');
    if( grid === undefined ) throw('Required parameter "grid" undefined');
    if( algorithm === undefined ) throw('Required parameter "algorithm" undefined');

    return new algorithm(grid, spawns, seed);
  }
  step() {
    if( ! this.tiles.isCompleted() ) {
      this.tiles.step();
    } else if ( this.spawns === undefined ) {
      this.spawns = this.initialize_spawns({...this.spawnParams, grid: this.tiles}, this.seed);
    }else if ( this.spawns && ! this.spawns.isCompleted() ) {
      this.spawns.step();
    }
  }
  isCompleted() {
    //todo FSM
    return this.tiles.isCompleted() && this.spawns && this.spawns.isCompleted();
  }
}
