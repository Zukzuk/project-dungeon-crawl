import Grid from './grid';
import FSM from 'javascript-state-machine';
import PRNG from './pseudo-random-number-generator';

export default class RandomSpawn {
  constructor(grid, spawns, seed) {
    /**************************************************************************
      spawns is expected to be a object with number values indicating how many
      objects of type "key" should be spawned:
      { "player": 1, "bat": 10, "giant rat": 5 }
    **************************************************************************/
    this.initialSpawns = spawns;
    this.spawnsLeft = {...spawns};
    this.spawns = [];
    this.spawnIndex = {};

    this.tileGrid = grid;
    this.initialize_spawn_grid();

    this.prng = new PRNG(seed);
    this.completed = false;
  }

  initialize_spawn_grid() {
    let paintVal = 1;
    const grid = this.tileGrid.grid;
    const spawnGrid = this.spawnGrid = Grid.gridFromArray(grid.flattenedGrid(), grid.width()); // clone grid
    spawnGrid.repaint( (val) => val === 1 ? paintVal++ : 0 );

    // fill the object with the tiles in the tileGrid, key: tile value, value: position of tile
    const spawnHash = this.spawnHash = {};
    spawnGrid.each_cb( (tileVal, tilePos) => {
      if( tileVal ) {
        spawnHash[tileVal] = tilePos;
      }
    });
  }
  step() {
    const key = Object.keys(this.spawnsLeft)[0];
    // if no more keys left, then algorithm is finished
    if( key === undefined ) {
      this.completed = true;
      return true;
    }

    const spawnHash = this.spawnHash;
    const spawnHashKeys = Object.keys(spawnHash);
    const randomTile = spawnHashKeys[this.prng.next() % spawnHashKeys.length];
    const randomTilePos = spawnHash[randomTile];
    delete spawnHash[randomTile];

    this.spawns.push([randomTilePos, key]);
    const spawnIndex = this.spawnIndex;
    if( spawnIndex[randomTilePos[1]] === undefined )
      spawnIndex[randomTilePos[1]] = {};
    spawnIndex[randomTilePos[1]][randomTilePos[0]] = key;

    this.spawnsLeft[key]--;
    if( this.spawnsLeft[key] === 0 )
      delete this.spawnsLeft[key];

    return [randomTilePos, key];
  }
  isCompleted() {
    return this.completed;
  }
}
