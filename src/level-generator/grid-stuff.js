

export default class GridStuff {
  static generateGrid(width, height, value = 0) {
    const rowTempl = Array.apply(null, Array(width)).map( () => value );
    return Array.apply(null, Array(height)).map( () => rowTempl.slice() );
  }
  static sumGrid(grid) {
    return grid.map( (line) => line.reduce( (a,b) => a+b ) ).reduce( (a,b) => a+b );
  }
  static countNonZero(grid) {
    var count = 0;
    const width = grid[0].length;
    for( var y=0, row; row = grid[y]; y++ ) {
      for( var x=0; x < width; x++ ) {
        if( row[x] )
          count++;
      }
    }
    return count;
  }
  static countValue(grid, value) {
    var count = 0;
    const width = grid[0].length;
    for( var y=0, row; row = grid[y]; y++ ) {
      for( var x=0; x < width; x++ ) {
        if( row[x] == value )
          count++;
      }
    }
    return count;
  }
  static copyGrid(grid) {
    return grid.map( (line) => line.slice() );
  }
  static flattenGrid(grid) {
    return Array.prototype.concat.apply([], grid);
  }
  static gridFromArray(arr, width) {
    if( ! width )
      throw 'gridFromArray: Width parameter not defined or zero';
    var grid = [];
    for( var i=0, len=arr.length; i < len; i+=width) {
      grid.push(arr.slice(i, width + i));
    }
    return grid;
  }
  static moveTiles(grid, tiles, direction) {
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
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    tiles = tiles.slice().sort(boundSortFunc);
    for( var i=tiles.length; i--; ) {
      var [x, y] = tiles[i];
      var row = grid[y];
      var newX = x + xDirection;
      var newY = y + yDirection;
      if( newX >= 0 && newX < gridWidth && newY >= 0 && newY < gridHeight )
        grid[y + yDirection][x + xDirection] = row[x];
      row[x] = 0;
    }
  }
  static colorRoom(grid, pos, color) {
    const roomID = grid[pos[1]][pos[0]];

    const paintRoom = (x, y, grid, roomID, color, nextPaint = []) => {
      if( y > 0 && grid[y-1][x] === roomID ) {
        grid[y-1][x] = color;
        nextPaint.push(paintRoom.bind(null, x, y-1, grid, roomID, color, nextPaint));
      }
      if( y < grid.length-1 && grid[y+1][x] === roomID ) {
        grid[y+1][x] = color;
        nextPaint.push(paintRoom.bind(null, x, y+1, grid, roomID, color, nextPaint));
      }
      if( x > 0 && grid[y][x-1] === roomID ) {
        grid[y][x-1] = color;
        nextPaint.push(paintRoom.bind(null, x-1, y, grid, roomID, color, nextPaint));
      }
      if( x < grid[0].length-1 && grid[y][x+1] === roomID ) {
        grid[y][x+1] = color;
        nextPaint.push(paintRoom.bind(null, x+1, y, grid, roomID, color, nextPaint));
      }
      return nextPaint;
    }

    const nextPaint = [];
    nextPaint.push(paintRoom.bind(null, pos[0], pos[1], grid, roomID, color, nextPaint));
    while( nextPaint.length ) {
      nextPaint.pop()();
    }
  }
}
