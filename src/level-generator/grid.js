import GridStuff from './grid-stuff';

export default class Grid {
  constructor(width = 50, height = 50, value = 0) {
    this.width = width;
    this.height = height;
    const rowTempl = Array.apply(null, Array(width)).map( () => value );
    this.rawGrid = Array.apply(null, Array(height)).map( () => rowTempl.slice() );
  }
  sumGrid() {
    return this.rawGrid.map( (line) => line.reduce( (a,b) => a+b ) ).reduce( (a,b) => a+b );
  }
  countNonZero() {
    var count = 0;
    const width = this.rawGrid[0].length;
    for( var y=0, row; row = this.rawGrid[y]; y++ ) {
      for( var x=0; x < width; x++ ) {
        if( row[x] )
          count++;
      }
    }
    return count;
  }
  countValue(value) {
    var count = 0;
    const width = this.rawGrid[0].length;
    for( var y=0, row; row = this.rawGrid[y]; y++ ) {
      for( var x=0; x < width; x++ ) {
        if( row[x] == value )
          count++;
      }
    }
    return count;
  }
  copyRawGrid() {
    return this.rawGrid.map( (line) => line.slice() );
  }
  flattenedGrid() {
    return GridStuff.flattenedGrid(this.rawGrid);
  }
  drawRoom(room, position, roomID = 1) {
    const rawGrid = this.rawGrid;
    const [xPos, yPos] = position;
    const [roomWidth, roomHeight] = room;
    for( var y = 0, gridLine; y < roomHeight; y++ ) {
      gridLine = rawGrid[y+yPos];
      for( var x = 0; x < roomWidth; x++ ) {
        gridLine[x+xPos] = roomID;
      }
    }
  };
  moveTiles(tiles, direction) {
    if( direction[0] == 0 && direction[1] == 0 ) {
      return;
    }
    const sortFunc = (orderX, orderY, tilePosA, tilePosB) => {
      var r = tilePosA[0] * orderX - tilePosB[0] * orderX;
      if( r !== 0 )
        return r;
      r = tilePosA[1] * orderY - tilePosB[1] * orderY;
      if( r !== 0 )
        return r;
      // if both return zero, then either (or both) orderX and orderY must be zero
      //   as tiles supplied are supposed to be unique
      // return simple x1 > x2, y1 > y2
      // The trick here is that true is 1, and false is 0.
      // true * 2 - 1 == 1
      // false * 2 - 1 == -1
      if( tilePosA[0] != tilePosB[0] )
        return (tilePosA[0] > tilePosB[0]) * 2 - 1;
      return (tilePosA[1] > tilePosB[1]) * 2 - 1;
    }
    const [xDirection, yDirection] = direction;
    // binding direction for sorting order
    const boundSortFunc = sortFunc.bind(null, xDirection, yDirection);
    // an optimization could be done where only tiles are moved which will change
    // in value. For example, when moving 1 tile to the right, only the left most
    // tiles need to be moved to the right-most position, if all tiles have the
    // same value
    const rawGrid = this.rawGrid;
    const gridWidth = this.width;
    const gridHeight = this.height;
    tiles = tiles.slice().sort(boundSortFunc);
    for( var i=tiles.length; i--; ) {
      var [x, y] = tiles[i];
      var row = rawGrid[y];
      var newX = x + xDirection;
      var newY = y + yDirection;
      if( newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight )
        rawGrid[y + yDirection][x + xDirection] = row[x];
      row[x] = 0;
    }
  }
  colorRoom(pos, paint) {
    const rawGrid = this.rawGrid;
    const roomID = rawGrid[pos[1]][pos[0]];

    const paintRoom = (x, y, rawGrid, roomID, paint, nextPaint = []) => {
      if( y > 0 && rawGrid[y-1][x] === roomID ) {
        rawGrid[y-1][x] = paint;
        nextPaint.push(paintRoom.bind(null, x, y-1, rawGrid, roomID, paint, nextPaint));
      }
      if( y < rawGrid.length-1 && rawGrid[y+1][x] === roomID ) {
        rawGrid[y+1][x] = paint;
        nextPaint.push(paintRoom.bind(null, x, y+1, rawGrid, roomID, paint, nextPaint));
      }
      if( x > 0 && rawGrid[y][x-1] === roomID ) {
        rawGrid[y][x-1] = paint;
        nextPaint.push(paintRoom.bind(null, x-1, y, rawGrid, roomID, paint, nextPaint));
      }
      if( x < rawGrid[0].length-1 && rawGrid[y][x+1] === roomID ) {
        rawGrid[y][x+1] = paint;
        nextPaint.push(paintRoom.bind(null, x+1, y, rawGrid, roomID, paint, nextPaint));
      }
      return nextPaint;
    };

    const nextPaint = [];
    nextPaint.push(paintRoom.bind(null, pos[0], pos[1], rawGrid, roomID, paint, nextPaint));
    while( nextPaint.length ) {
      nextPaint.pop()();
    }
  }
  crop(rimThickness = 1, rimValue = 0) {
    GridStuff.crop(this.rawGrid, rimThickness, rimValue);
    this.width = this.rawGrid[0].length;
    this.height = this.rawGrid.length;
  }
  cropable(rimThickness = 1, rimValue = 0) {
    return GridStuff.cropable(this.rawGrid, rimThickness, rimValue);
  }
}
