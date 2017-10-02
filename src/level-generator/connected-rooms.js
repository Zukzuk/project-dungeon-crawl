
import GridStuff from './grid-stuff';

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
}

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
window.PRNG.prototype.next = function () {
  return this._seed = this._seed * 16807 % 2147483647;
};
window.PRNG.prototype.nextBetween = function (x,y) {
  // assumes x > y
  return this.next() % (y-x+1) + x;
}

/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
window.PRNG.prototype.nextFloat = function (opt_minOrMax, opt_max) {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (this.next() - 1) / 2147483646;
};

export default class ConnectedRooms {
  constructor(width, height, seed = Math.floor(Math.random() * 2**32), numTiles = Math.floor(width * height / 4)) {
    this.width = width;
    this.height  = height;
    this.seed = seed;
    this.requestedNumTiles = numTiles;
    this.minRoomWidth = 2;
    this.minRoomHeight = 2;
    this.minRoomFactor = 0.5;
    const maxRoomSize = Math.floor(Math.min(width, height)/4);
    this.maxRoomHeight = maxRoomSize;
    this.maxRoomWidth = maxRoomSize;
    this.rooms = []; // filled with room objects: {roomID: n, pos: [x,y]}
    this.grid = GridStuff.generateGrid(width, height, 0);
    this.prng = new PRNG(seed);
    this.completed = false;
  };
  step(action) {
    const grid = this.grid;
    const sg = GridStuff.countNonZero(grid);
    if( action === "add room" || (action === undefined && sg < this.requestedNumTiles) ) {
      const room = this.generateRoom();
      const position = this.generateRoomPosition(room);
      this.drawRoom(room, position);
      return;
    } else if (action === "connect room" || (action === undefined && sg >= this.requestedNumTiles && this.rooms.length !== 1) ) {
      if( this.rooms.length == 0 ) {
        this.detectAndColorRooms();
        return;
      }
      var room = this.rooms[0];
      var [nearestPointA, nearestPointB] = this.detectNearestRoom(room); // nearData contains nearestPointA, nearestPointB, where A is in room A and B in B
      this.mergeRooms(nearestPointA, nearestPointB);
      return;
    } else if (action === "paint first room one" || (action === undefined && sg >= this.requestedNumTiles &&
                                                      this.rooms.length === 1 && this.rooms[0].roomID !== 1 )) {
      GridStuff.colorRoom(grid, this.rooms[0].pos, 1);
      this.rooms[0].roomID = 1;
      return;
    }
    this.completed = true;
  };
  isCompleted() {
    return this.completed;
  };
  detectAndColorRooms() {
    const grid = this.grid; //GridStuff.copyGrid(this.grid);
    const width = this.width;
    const height = this.height;
    const paintRoom = (x, y, grid, num, nextPaint = []) => {
      if( y > 0 && grid[y-1][x] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x, y-1, grid, num, nextPaint));
        grid[y-1][x] = num;
      }
      if( y < height-1 && grid[y+1][x] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x, y+1, grid, num, nextPaint));
        grid[y+1][x] = num;
      }
      if( x > 0 && grid[y][x-1] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x-1, y, grid, num, nextPaint));
        grid[y][x-1] = num;
      }
      if( x < width-1 && grid[y][x+1] == 1 ) {
        nextPaint.push(paintRoom.bind(null, x+1, y, grid, num, nextPaint));
        grid[y][x+1] = num;
      }
      return nextPaint;
    }
    const rooms = this.rooms = [];
    //var maxStackLen = 0;
    //var paints = 1;
    for( var y = 0; y < height; y++ ) {
      for( var x = 0; x < width; x++ ) {
        if( grid[y][x] == 1 ) {
          var room = {roomID: rooms.length + 3, pos: [x,y]};
          rooms.push(room);
          // paint current tile
          grid[y][x] = room.roomID;
          // queue paint jobs to paint tiles around the current tile (paintRoom adds new paint requests to nextPaint)
          const nextPaint = [];
          nextPaint.push(paintRoom.bind(null, x, y, grid, room.roomID, nextPaint));
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

    // Could flatten grid for performance, and easier iteration.
    //const cGrid = GridStuff.copyGrid(this.grid);
    const fGrid = GridStuff.flattenGrid(this.grid);
    // paint around the room with a character + room number, until another room is found
    const gridWidth = this.grid[0].length;
    const gridHeight = this.grid.length;
    const fGridLen = fGrid.length;
    const index = roomA.pos[0] + roomA.pos[1] * gridWidth;
    const roomID = fGrid[index];
    const roomPaint = roomID + "d0";
    var nextPaintRoom = [];
    var nextPaintEdge = [];
    const paintEdge = (fGrid, index, roomID, distance, gridWidth, nextPaintEdge, paintEdgeF) => {
      const detectPaint = roomID + "d" + (distance+1);
      const tileVal = fGrid[index];
      var otherTile;
      const offsets = [-gridWidth, gridWidth, -1, 1];

      for( var i=0, len=offsets.length; i < len; i++ ) {
        var idx = offsets[i] + index;
        if( i > 1 && Math.abs( idx % gridWidth - index % gridWidth ) > 1 ) {
          // if moving over X axis, and diff X is bigger than one, then we wrapped over edge of level.
          continue;
        }
        otherTile = fGrid[idx];
        if( otherTile === 0 ) {
          fGrid[idx] = detectPaint;
          nextPaintEdge.push(paintEdgeF.bind(null, fGrid, idx, roomID, distance+1, gridWidth, nextPaintEdge, paintEdgeF));
        } else if( typeof(otherTile) === "number" ) {
          // return x,y of other tile found
          return [idx % gridWidth, Math.floor(idx / gridWidth)];
        }
      }
      return false;
    }
    const paintRoom = (fGrid, index, roomID, gridWidth, nextPaintRoom, nextPaintEdge, paintEdgeF) => {
      const roomPaint = roomID + "d0";
      const edgePaint = roomID + "d1";
      const tileVal = fGrid[index];
      var otherTile = undefined;
      // offsets up, down, left, right
      const offsets = [-gridWidth, gridWidth, -1, 1];

      for( var i=0, len=4, idx; i < len; i++ ) {
        idx = offsets[i] + index;
        otherTile = fGrid[idx];
        if( otherTile === 0 ) {
          fGrid[idx] = edgePaint;
          nextPaintEdge.push(paintEdgeF.bind(null, fGrid, idx, roomID, 1, gridWidth, nextPaintEdge, paintEdgeF));
        } else if( otherTile === roomID ) {
          fGrid[idx] = roomPaint;
          nextPaintRoom.push(paintRoom.bind(null, fGrid, idx, roomID, gridWidth, nextPaintRoom, nextPaintEdge, paintEdgeF));
        }
      }
    }
    fGrid[index] = roomID + "d0";
    nextPaintRoom.push(paintRoom.bind(null, fGrid, index, roomID, gridWidth, nextPaintRoom, nextPaintEdge, paintEdge));
    while( nextPaintRoom.length ) {
      nextPaintRoom.pop()();
    }
    var nearestRoomTiles = [];
    while(nextPaintEdge.length && ! nearestRoomTiles.length) { // nextPaintEdge array is filled by calls to paintAroundRoom
      var edgeTiles = nextPaintEdge.slice(); // create copy of nextPaintEdge array
      nextPaintEdge.splice(0, nextPaintEdge.length); // empty nextPaintEdge array

      for( var i=0, boundPaintAroundRoom; boundPaintAroundRoom = edgeTiles[i]; i++ ) {
        var result = boundPaintAroundRoom();
        if( result )
          nearestRoomTiles.push(result);
      }
    }
    //console.log(GridStuff.gridFromArray(fGrid, gridWidth));
    //console.log(nearestRoomTiles);
    const traceOrigin = (fGrid, index, gridWidth) => {
      const origIndex = index;
      const offset = [-gridWidth, gridWidth, -1, 1];
      var curPaint = fGrid[index];
      if( typeof(curPaint) === "number" ) {
        for( var i=0; i<4; i++) {
          var otherTile = fGrid[origIndex + offset[i]];
          if( typeof(otherTile) === "string" ) {
            if( typeof(curPaint) === "number" || typeof(curPaint) === "string" && curPaint.slice(2) > otherTile.slice(2) ) {
              index = origIndex + offset[i];
              curPaint = otherTile;
            }
          };
        };
      };
      var distance = parseInt(curPaint.slice(2));
      if( distance === 0 )
        return [index % gridWidth, Math.floor(index / gridWidth)];

      var lowerPaint = curPaint.slice(0,2) + (distance - 1);
      while( true ) {
        var curIndex = index;
        for( var i=0; i<4; i++) {
          if( fGrid[index + offset[i]] === lowerPaint ) {
            var index = curIndex + offset[i];
            distance--;
            if( distance === 0 )
              return [index % gridWidth, Math.floor(index / gridWidth)];
            curPaint = lowerPaint;
            lowerPaint = curPaint.slice(0,2) + (distance - 1);
            break;
          }
        }
        if( i === 4 ) {
          debugger;
          throw 'traceOrigin should never end up at this point! i = ' + i;
        }
      }
      const cGrid = GridStuff.gridFromArray(fGrid, width);
      console.log(cGrid);
      debugger;
      throw 'traceOrigin should never end up at this point!';
    }
    const point = nearestRoomTiles[0];
    origin = traceOrigin(fGrid, point[0] + point[1]*gridWidth, gridWidth);
    return [origin, point];
  }
  mergeRooms(roomA, roomB) {
    const grid = this.grid;
    var sizeA = GridStuff.countValue(grid, grid[roomA[1]][roomA[0]]);
    var sizeB = GridStuff.countValue(grid, grid[roomB[1]][roomB[0]]);
    if( sizeB > sizeA ) // reverse the two rooms, so that B <= A
      [roomA, roomB, sizeA, sizeB] = [roomB, roomA, sizeB, sizeA];
    var roomIDa = grid[roomA[1]][roomA[0]];
    var roomIDb = grid[roomB[1]][roomB[0]];
    if( ! roomIDa || ! roomIDb )
      throw('mergeRooms; Invalid roomID. roomIDa: ' + roomIDa + ' [' + JSON.stringify(roomA) +
                                     '], roomIDb: ' + roomIDb + ' [' + JSON.stringify(roomB) + ']');

    // set vector for moving the smallest room
    // the goal is to have the two rooms adjacent, not overlapping
    var direction = [roomA[0] - roomB[0], roomA[1] - roomB[1]];
    if( direction[0] ) { // if X is not zero, then increment/decrement it by one
      direction[0] += ( direction[0] < 0 ) * 2 - 1;
    } else { // else increment or decrement Y by one
      direction[1] += ( direction[1] < 0 ) * 2 - 1;
    }

    this.moveRoom(roomB, direction);
    roomB = [roomB[0] + direction[0], roomB[1] + direction[1]];
    GridStuff.colorRoom(grid, roomB, roomIDa);

    const roomIndexByID = ((roomIDb, room) => {
      return room.roomID === roomIDb;
    }).bind(null, roomIDb);
    const roomIndex = this.rooms.findIndex(roomIndexByID);
    if( roomIndex < 0 )
      console.error('Room index not found; roomIDb: ', roomIDb, 'roomB', roomB);
    else
      this.rooms.splice(roomIndex, 1);
  }
  moveRoom(roomPosition, direction) {
    const grid = this.grid;
    const [xPos, yPos] = roomPosition;
    const [xDirection, yDirection] = direction;
    var roomID = grid[yPos][xPos];
    if( ! roomID )
      throw('moveRoom; Invalid roomID. roomID: ' + roomID);

    // getRoomTiles is destructive to the grid. Be careful to reuse the supplied grid
    const getRoomTiles = (fGrid, index, roomID, gridWidth, nextPaintRoom = [], allTiles = []) => {
      const roomPaint = roomID + "d";
      var otherTile = undefined;
      const offsets = [-gridWidth, gridWidth, -1, 1];

      for( var i=0, len=4, idx; i < len; i++ ) {
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
    const index = xPos + yPos * this.width;
    const allTiles = [];
    const nextPaintRoom = [];

    nextPaintRoom.push(getRoomTiles.bind(null, GridStuff.flattenGrid(grid), index, roomID, this.width, nextPaintRoom, allTiles));
    while( nextPaintRoom.length ) {
      nextPaintRoom.pop()();
    }
    GridStuff.moveTiles(grid, allTiles, direction);

  }
  generateDungeon() {
    const countNonZero = GridStuff.countNonZero;
    while(countNonZero(this.grid) < this.requestedNumTiles)
      this.step("add room");
  };
  generateRoom(maxSize=undefined) {
    const nextBetween = this.prng.nextBetween.bind(this.prng);
    const minRoomFactor = this.minRoomFactor;
    const width = nextBetween(this.minRoomWidth, this.maxRoomWidth);
    const height = nextBetween(Math.max(Math.ceil(width * minRoomFactor), this.minRoomHeight),
                               Math.min(Math.floor(width / minRoomFactor), this.maxRoomHeight));
    return [width, height];
  };
  generateRoomPosition(room) {
    const nextBetween = this.prng.nextBetween.bind(this.prng);
    const maxX = this.width - room[0];
    const maxY = this.height - room[1];
    return [nextBetween(0, maxX), nextBetween(0, maxY)];
  };
  drawRoom(room, position) {
    const grid = this.grid;
    var yGrid = [];
    for( var y = 0; y < room[1]; y++ ) {
      yGrid = grid[y+position[1]];
      for( var x = 0; x < room[0]; x++ ) {
        yGrid[x+position[0]] = 1;
      }
    }
  };
  gridInfo() {
    const gridInfoValues = {};
    gridInfoValues.gridSize = JSON.stringify([this.width, this.height]);
    gridInfoValues.seed = this.seed;
    gridInfoValues.levelSize = GridStuff.countNonZero(this.grid) + " of " + this.requestedNumTiles;
    gridInfoValues.maxRoomSize = JSON.stringify([this.maxRoomWidth, this.maxRoomHeight]);
    return gridInfoValues;
  }
}

//window.GridStuff = GridStuff;
//window.ConnectedRooms = ConnectedRooms;
