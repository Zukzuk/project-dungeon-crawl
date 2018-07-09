import Grid from './grid';
import StateMachine from 'javascript-state-machine';


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
window.PRNG.prototype.nextBetween = function (x,y) {
  // assumes x > y
  return this.next() % (y-x+1) + x;
};

/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
window.PRNG.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

export default class ConnectedRooms {
  constructor(width, height, seed = Math.floor(Math.random() * Math.pow(2, 32)), numTiles = Math.floor(width * height / 4)) {
    this.initialWidth = width;
    this.initialHeight  = height;
    this.seed = seed;
    this.requestedNumTiles = numTiles;
    this.minRoomWidth = 2;
    this.minRoomHeight = 2;
    this.minRoomFactor = 0.5;
    const maxRoomSize = Math.floor(Math.min(width, height)/4);
    this.maxRoomHeight = maxRoomSize;
    this.maxRoomWidth = maxRoomSize;
    this.rooms = []; // filled with room objects: {roomID: n, pos: [x,y]}
    this.grid = new Grid(width, height, 0); //GridStuff.generateGrid(width, height, 0);
    this.prng = new window.PRNG(seed);
    this.completed = false;
    this.phaseSM = this.initialize_fsm();
  }
  initialize_fsm() {
    const fsm = new StateMachine({
      init: 'creating',
      transitions: [
        { name: 'connect', from: 'creating', to: 'connecting' },
        { name: 'crop', from: 'connecting', to: 'cropping' },
        { name: 'complete', from: 'cropping', to: 'finished' }
      ],
      methods: {
        onEnterConnecting: (event, from, to) => {this.detectAndColorRooms();},
        onLeaveConnecting: (event, from, to) => {
          this.grid.colorRoom(this.rooms[0].pos, 1);
          this.rooms[0].roomID = 1;
        },
      }
    });
    return fsm;
  }
  step(phase) {
    if( phase === undefined )
      phase = this.phaseSM.state;

    switch(phase) {
      case 'creating':
        this.stepPhaseCreating();
        break;
      case 'connecting':
        this.stepPhaseConnecting();
        break;
      case 'cropping':
        this.stepPhaseCropping();
        break;
      case 'finished':
        this.completed = true;
        return true;
      default:
        window.console.log('Unable to handle step for phase:', phase);
    }
  }
  stepPhaseCreating() {
    const grid = this.grid;

    if( grid.countNonZero() < this.requestedNumTiles ) {
      const room = this.generateRoom();
      const position = this.generateRoomPosition(room);
      grid.drawRoom(room, position);
      if( this.rooms.length )
        this.rooms = [];
      return;
    } else {
      this.phaseSM.connect();
    }
  }
  stepPhaseConnecting() {
    if( this.rooms.length !== 1 ) {
      // check for all rooms how far they are from their nearest other rooms,
      // and remember the first room with the smallest distance to any other.
      let [nearestPointA, nearestPointB] = [undefined, undefined];
      let curDistance = Infinity;
      for( let i = 0, len=this.rooms.length; i < len; i++ ) {
        let room = this.rooms[i];
        let [nearA, nearB] = this.detectNearestRoom(room); // nearData contains nearestPointA, nearestPointB, where A is in room A and B in B
        let distance = Math.abs(nearA[0] - nearB[0]) + Math.abs(nearA[1] - nearB[1]);
        if( distance < curDistance ) {
          curDistance = distance;
          [nearestPointA, nearestPointB] = [nearA, nearB];
        }
      }
      // For the room which is closest to another, merge it with that nearby room
      this.mergeRooms(nearestPointA, nearestPointB);
      return;
    } else {
      this.phaseSM.crop();
    }
  }
  stepPhaseCropping() {
    this.grid.crop();
    this.phaseSM.complete();
  }
  isCompleted() {
    return this.completed;
  }
  detectAndColorRooms() {
    const grid = this.grid;
    const rawGrid = grid.rawGrid;
    const width = grid.width();
    const height = grid.height();
    const paintRoom = (x, y, rawGrid, num, nextPaint = []) => {
      if( y > 0 && rawGrid[y-1][x] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x, y-1, rawGrid, num, nextPaint));
        rawGrid[y-1][x] = num;
      }
      if( y < height-1 && rawGrid[y+1][x] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x, y+1, rawGrid, num, nextPaint));
        rawGrid[y+1][x] = num;
      }
      if( x > 0 && rawGrid[y][x-1] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x-1, y, rawGrid, num, nextPaint));
        rawGrid[y][x-1] = num;
      }
      if( x < width-1 && rawGrid[y][x+1] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x+1, y, rawGrid, num, nextPaint));
        rawGrid[y][x+1] = num;
      }
      return nextPaint;
    };
    // paint every tile with a value as 1. Zero stays zero.
    grid.repaint( (val) => ( val ? 1 : 0 ) );
    // (re)set this.rooms
    const rooms = this.rooms = [];

    //var maxStackLen = 0;
    //var paints = 1;
    for( let y = 0; y < height; y++ ) {
      for( let x = 0; x < width; x++ ) {
        if( rawGrid[y][x] == 1 ) {
          let room = {roomID: rooms.length + 3, pos: [x,y]};
          rooms.push(room);
          // paint current tile
          rawGrid[y][x] = room.roomID;
          // queue paint jobs to paint tiles around the current tile (paintRoom adds new paint requests to nextPaint)
          const nextPaint = [];
          nextPaint.push(paintRoom.bind(null, x, y, rawGrid, room.roomID, nextPaint));
          while( nextPaint.length ) {
            nextPaint.pop()();
          }
        }
      }
    }
    //console.log("Paints: " + paints + ", maxStackLen: " + maxStackLen);
  }
  detectNearestRoom(roomA) {
    /* walk over the edge of the room and expand the edge until another room is found. */
    /* A tile is considered an edge tile if it has any tile with 0 or detection paint on it. */
    /* detection paint contains a "d" as second character */
    /* */
    /* This consists of two phases */
    /* 1: detect the entire room and its edge (painting over the room with <roomID>d0, and the edge with <roomID>d1) */
    /* 2: with the detected edge from phase one, paint over any tiles containing 0 with <roomID>d<distance> */

    const fGrid = this.grid.flattenedGrid();
    // paint around the room with a character + room number, until another room is found
    const grid = this.grid;
    const [gridWidth, gridHeight] = [grid.width(), grid.height()];
    const fGridLen = fGrid.length;
    const index = roomA.pos[0] + roomA.pos[1] * gridWidth;
    const roomID = fGrid[index];
    const roomPaint = roomID + "d0";
    let nextPaintRoom = [];
    let nextPaintEdge = [];
    const paintEdge = (fGrid, index, roomID, distance, gridWidth, nextPaintEdge, paintEdgeF) => {
      const detectPaint = roomID + "d" + (distance+1);
      const tileVal = fGrid[index];
      let otherTile;
      const offsets = [-gridWidth, gridWidth, -1, 1];
      const otherRoomTiles = [];

      for( let i=0, len=offsets.length; i < len; i++ ) {
        let idx = offsets[i] + index;
        // if moving over X axis, and diff X is bigger than one, then we wrapped over edge of level.
        if( i > 1 && Math.abs( idx % gridWidth - index % gridWidth ) > 1 )
          continue;

        otherTile = fGrid[idx];
        if( otherTile === 0 ) {
          fGrid[idx] = detectPaint;
          nextPaintEdge.push(paintEdgeF.bind(null, fGrid, idx, roomID, distance+1, gridWidth, nextPaintEdge, paintEdgeF));
        } else if( typeof(otherTile) === "number" ) {
          // return x,y of other tile found, which could be multiple but we'll return only one.
          otherRoomTiles.push([idx % gridWidth, Math.floor(idx / gridWidth)]);
        }
      }
      return otherRoomTiles;
    };
    const paintRoom = (fGrid, index, roomID, gridWidth, nextPaintRoom, nextPaintEdge, paintEdgeF) => {
      const roomPaint = roomID + "d0";
      const edgePaint = roomID + "d1";
      const tileVal = fGrid[index];
      let otherTile = undefined;
      const otherRoomTiles = [];
      // offsets up, down, left, right
      const offsets = [-gridWidth, gridWidth, -1, 1];

      for( let i=0, len=4, idx; i < len; i++ ) {
        idx = offsets[i] + index;
        // prevent x-wrapping
        if( i > 1 && Math.abs(idx % gridWidth - index % gridWidth) > 1 )
          continue;

        otherTile = fGrid[idx];
        if( otherTile === 0 ) {
          fGrid[idx] = edgePaint;
          nextPaintEdge.push(paintEdgeF.bind(null, fGrid, idx, roomID, 1, gridWidth, nextPaintEdge, paintEdgeF));
        } else if( otherTile === roomID ) {
          fGrid[idx] = roomPaint;
          nextPaintRoom.push(paintRoom.bind(null, fGrid, idx, roomID, gridWidth, nextPaintRoom, nextPaintEdge, paintEdgeF));
        } else if( typeof(otherTile) === "number" ) {
          // remember x,y of other tile found
          otherRoomTiles.push([idx % gridWidth, Math.floor(idx / gridWidth)]);
        }
      }
      return otherRoomTiles;
    };

    const nearestRoomTiles = [];
    const pushInNRT = Function.apply.bind(Array.prototype.push, nearestRoomTiles);
    fGrid[index] = roomID + "d0";
    nextPaintRoom.push(paintRoom.bind(null, fGrid, index, roomID, gridWidth, nextPaintRoom, nextPaintEdge, paintEdge));
    while( nextPaintRoom.length ) {
      pushInNRT( nextPaintRoom.pop()() );
    }

    while(nextPaintEdge.length && ! nearestRoomTiles.length) { // nextPaintEdge array is filled by calls to paintAroundRoom
      let edgeTiles = nextPaintEdge.slice(); // create copy of nextPaintEdge array
      nextPaintEdge.splice(0, nextPaintEdge.length); // empty nextPaintEdge array

      for( let i=0, boundPaintAroundRoom; (boundPaintAroundRoom = edgeTiles[i]); i++ ) {
        pushInNRT( boundPaintAroundRoom() );
      }
    }
    //console.log(GridStuff.gridFromArray(fGrid, gridWidth));
    //console.log(nearestRoomTiles);
    const traceOrigin = (fGrid, index, gridWidth, roomID) => {
      const origIndex = index;
      const offset = [-gridWidth, gridWidth, -1, 1];
      let curPaint = fGrid[index];
      if( typeof(curPaint) === "number" ) {
        for( let i=0; i<4; i++) {
          let otherTile = fGrid[origIndex + offset[i]];
          if( typeof(otherTile) === "string" ) {
            if( typeof(curPaint) === "number" || typeof(curPaint) === "string" && curPaint.split('d')[1] > otherTile.split('d')[1] ) {
              index = origIndex + offset[i];
              curPaint = otherTile;
            }
          }
        }
      }
      let distance = parseInt(curPaint.split('d')[1]);
      if( distance === 0 )
        return [index % gridWidth, Math.floor(index / gridWidth)];

      let lowerPaint = curPaint.split('d')[0] + "d" + (distance - 1);
      let tracing = true;
      while( tracing ) {
        let curIndex = index;
        let i=0;
        for( ; i<4; i++) {
          if( fGrid[index + offset[i]] === lowerPaint ) {
            index = curIndex + offset[i];
            distance--;
            if( distance === 0 )
              return [index % gridWidth, Math.floor(index / gridWidth)];
            curPaint = lowerPaint;
            lowerPaint = curPaint.split("d")[0] + "d" + (distance - 1);
            break;
          }
        }
        if( i === 4 ) {
          const cGrid = Grid.gridFromArray(fGrid, gridWidth);
          throw 'traceOrigin should never end up at this point! i = ' + i + ', grid: ' + JSON.stringify(cGrid.rawGrid);
        }
      }
      const cGrid = Grid.gridFromArray(fGrid, gridWidth);
      throw 'traceOrigin should never end up at this point! Grid: ' + JSON.stringify(grid.rawGrid);
    };
    const point = nearestRoomTiles[0];
    const origin = traceOrigin(fGrid, point[0] + point[1]*gridWidth, gridWidth, roomID);
    return [origin, point];
  }
  mergeRooms(roomA, roomB) {
    const grid = this.grid;
    const rawGrid = grid.rawGrid;
    let sizeA = grid.countValue(rawGrid[roomA[1]][roomA[0]]);
    let sizeB = grid.countValue(rawGrid[roomB[1]][roomB[0]]);
    if( sizeB > sizeA ) // reverse the two rooms, so that B <= A
      [roomA, roomB, sizeA, sizeB] = [roomB, roomA, sizeB, sizeA];
    let roomIDa = rawGrid[roomA[1]][roomA[0]];
    let roomIDb = rawGrid[roomB[1]][roomB[0]];
    if( ! roomIDa || ! roomIDb )
      throw('mergeRooms; Invalid roomID. roomIDa: ' + roomIDa + ' [' + JSON.stringify(roomA) +
                                     '], roomIDb: ' + roomIDb + ' [' + JSON.stringify(roomB) + ']');

    // set vector for moving the smallest room
    // the goal is to have the two rooms adjacent, not overlapping
    let direction = [roomA[0] - roomB[0], roomA[1] - roomB[1]];
    if( direction[0] ) { // if X is not zero, then increment/decrement it by one
      direction[0] += ( direction[0] < 0 ) * 2 - 1;
    } else { // else increment or decrement Y by one
      direction[1] += ( direction[1] < 0 ) * 2 - 1;
    }

    if( direction[0] != 0 || direction[1] != 0 ) {
      this.moveRoom(roomB, direction);
      roomB = [roomB[0] + direction[0], roomB[1] + direction[1]];
    }
    grid.colorRoom(roomB, roomIDa);

    const roomIndexByID = ((roomIDb, room) => {
      return room.roomID === roomIDb;
    }).bind(null, roomIDb);
    const roomIndex = this.rooms.findIndex(roomIndexByID);
    if( roomIndex < 0 )
      throw('Room index not found; roomIDb: ', roomIDb, 'roomB', roomB);
    else
      this.rooms.splice(roomIndex, 1);
  }
  moveRoom(roomPosition, direction) {
    const grid = this.grid;
    const rawGrid = grid.rawGrid;
    const gridWidth = rawGrid[0].length;
    const [xPos, yPos] = roomPosition;
    const [xDirection, yDirection] = direction;
    let roomID = rawGrid[yPos][xPos];
    if( ! roomID )
      throw('moveRoom; Invalid roomID. roomID: ' + roomID);

    // getRoomTiles is destructive to the grid. Be careful to reuse the supplied grid
    const getRoomTiles = (fGrid, index, roomID, gridWidth, nextPaintRoom = [], allTiles = []) => {
      const roomPaint = roomID + "d";
      let otherTile = undefined;
      const offsets = [-gridWidth, gridWidth, -1, 1];

      for( let i=0, len=4, idx; i < len; i++ ) {
        idx = offsets[i] + index;
        otherTile = fGrid[idx];
        if( otherTile === roomID ) {
          fGrid[idx] = roomPaint;
          allTiles.push([idx % gridWidth, Math.floor(idx / gridWidth)]);
          nextPaintRoom.push(getRoomTiles.bind(null, fGrid, idx, roomID, gridWidth, nextPaintRoom, allTiles));
        }
      }
      return allTiles;
    };
    const index = xPos + yPos * grid.width();
    const allTiles = [];
    const nextPaintRoom = [];

    nextPaintRoom.push(getRoomTiles.bind(null, grid.flattenedGrid(), index, roomID, gridWidth, nextPaintRoom, allTiles));
    while( nextPaintRoom.length ) {
      nextPaintRoom.pop()();
    }
    grid.moveTiles(allTiles, direction);

  }
  generateDungeon() {
    while(this.grid.countNonZero() < this.requestedNumTiles)
      this.step("add room");
  }
  generateRoom(maxSize=undefined) {
    const nextBetween = this.prng.nextBetween.bind(this.prng);
    const minRoomFactor = this.minRoomFactor;
    const width = nextBetween(this.minRoomWidth, this.maxRoomWidth);
    const height = nextBetween(Math.max(Math.ceil(width * minRoomFactor), this.minRoomHeight),
                               Math.min(Math.floor(width / minRoomFactor), this.maxRoomHeight));
    return [width, height];
  }
  generateRoomPosition(room) {
    const [width, height] = [this.grid.width(), this.grid.height()];
    const nextBetween = this.prng.nextBetween.bind(this.prng);
    const maxX = width - room[0];
    const maxY = height - room[1];
    return [nextBetween(0, maxX), nextBetween(0, maxY)];
  }
  drawRoom(room, position) {
    const rawGrid = this.grid.rawGrid;
    let yGrid = [];
    for( let y = 0; y < room[1]; y++ ) {
      yGrid = rawGrid[y+position[1]];
      for( let x = 0; x < room[0]; x++ ) {
        yGrid[x+position[0]] = 1;
      }
    }
  }
  gridInfo() {
    const gridInfoValues = {};
    const grid = this.grid;
    gridInfoValues.gridSize = JSON.stringify([grid.width(), grid.height()]);
    gridInfoValues.seed = this.seed;
    gridInfoValues.levelSize = grid.countNonZero() + " of " + this.requestedNumTiles;
    gridInfoValues.maxRoomSize = JSON.stringify([this.maxRoomWidth, this.maxRoomHeight]);
    return gridInfoValues;
  }
}

//window.GridStuff = GridStuff;
//window.ConnectedRooms = ConnectedRooms;
