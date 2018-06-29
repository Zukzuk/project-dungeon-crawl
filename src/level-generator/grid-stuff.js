

export default class GridStuff {
  static generateGrid(width, height, value = 0) {
    const rowTempl = Array.apply(null, Array(width)).map( () => value );
    return Array.apply(null, Array(height)).map( () => rowTempl.slice() );
  }
  static sumGrid(grid) {
    return grid.map( (line) => line.reduce( (a,b) => a+b ) ).reduce( (a,b) => a+b );
  }
  static countNonZero(grid) {
    let count = 0;
    const width = grid[0].length;
    for( let y=0, row; ( row = grid[y] ) ; y++ ) {
      for( let x=0; x < width; x++ ) {
        if( row[x] )
          count++;
      }
    }
    return count;
  }
  static countValue(grid, value) {
    let count = 0;
    const width = grid[0].length;
    for( let y=0, row; ( row = grid[y] ) ; y++ ) {
      for( let x=0; x < width; x++ ) {
        if( row[x] == value )
          count++;
      }
    }
    return count;
  }
  static copyGrid(grid) {
    return grid.map( (line) => line.slice() );
  }
  static flattenedGrid(grid) {
    return Array.prototype.concat.apply([], grid);
  }
  static gridFromArray(arr, width) {
    if( ! width )
      throw 'gridFromArray: Width parameter not defined or zero';
    let grid = [];
    for( let i=0, len=arr.length; i < len; i+=width) {
      grid.push(arr.slice(i, width + i));
    }
    return grid;
  }
  static moveTiles(grid, tiles, direction) {
    if( direction[0] == 0 && direction[1] == 0 ) {
      return;
    }
    const sortFunc = (orderX, orderY, tilePosA, tilePosB) => {
      let r = tilePosA[0] * orderX - tilePosB[0] * orderX;
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
    };
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
    for( let i=tiles.length, x, y, row, newX, newY; i--; ) {
      [x, y] = tiles[i];
      row = grid[y];
      newX = x + xDirection;
      newY = y + yDirection;
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
    };

    const nextPaint = [];
    nextPaint.push(paintRoom.bind(null, pos[0], pos[1], grid, roomID, color, nextPaint));
    while( nextPaint.length ) {
      nextPaint.pop()();
    }
  }
  static leftMost(grid, value=0, negate=true) {
    // look for the left most tile matching value, or not matching value if negated
    // return the column number
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    for( let x = 0; x < gridWidth ; x++ ) {
      for( let y = 0 ; y < gridHeight ; y++ ) {
        if( negate ? grid[y][x] != value : grid[y][x] == value ) {
          return x;
        }
      }
    }
    return gridWidth - 1;
  }
  static rightMost(grid, value=0, negate=true) {
    // look for the right most tile matching value, or not matching value if negated
    // return the column number
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    for( let x = gridWidth - 1; x >= 0 ; x-- ) {
      for( let y = 0 ; y < gridHeight ; y++ ) {
        if( negate ? grid[y][x] != value : grid[y][x] == value ) {
          return x;
        }
      }
    }
    return 0;
  }
  static topMost(grid, value=0, negate=true) {
    // look for the top most tile matching value, or not matching value if negated
    // return the row number
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    for( let y = 0 ; y < gridHeight ; y++ ) {
      let gridRow = grid[y];
      for( let x = 0; x < gridWidth ; x++ ) {
        if( negate ? gridRow[x] != value : gridRow[x] == value ) {
          return y;
        }
      }
    }
    return gridHeight - 1;
  }
  static bottomMost(grid, value=0, negate=true) {
    // look for the top most tile matching value, or not matching value if negated
    // return the row number
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    for( let y = gridHeight - 1 ; y >= 0 ; y-- ) {
      let gridRow = grid[y];
      for( let x = 0; x < gridWidth ; x++ ) {
        if( negate ? gridRow[x] != value : gridRow[x] == value ) {
          return y;
        }
      }
    }
    return 0;
  }
  static padTop(grid, numRows, value = 0) {
    // positive numRows adds rows, negative numRows removes rows
    const gridWidth = grid[0].length;
    if( numRows > 0 ) {
      const padding = Array.from( new Array(numRows), () => Array.from( new Array(gridWidth), () => value ) );
      grid.splice(0, 0, ...padding);
    } else if ( numRows < 0 ) {
      grid.splice(0, -numRows);
    }
    return grid;
  }
  static padBottom(grid, numRows, value = 0) {
    // positive numRows adds rows, negative numRows removes rows
    if( numRows > 0 ) {
      const gridWidth = grid[0].length;
      const padding = Array.from( new Array(numRows), () => Array.from( new Array(gridWidth), () => value ) );
      grid.push(...padding);
    } else if ( numRows < 0 ) {
      grid.splice(grid.length + numRows - 1, -numRows);
    }
    return grid;
  }
  static padLeft(grid, numCols, value = 0) {
    // positive numCols adds cols, negative numCols removes cols
    const gridHeight = grid.length;
    if( numCols > 0 ) {
      const padding = Array.from( new Array(numCols), () => value );
      for( let y = 0 ; y < gridHeight ; y++ ) {
        grid[y].splice(0, 0, ...padding);
      }
    } else if( numCols < 0 ) {
      for( let y = 0 ; y < gridHeight ; y++ ) {
        grid[y].splice(0, -numCols);
      }
    }
    return grid;
  }
  static padRight(grid, numCols, value = 0) {
    // positive numCols adds cols, negative numCols removes cols
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    if( numCols > 0 ) {
      const padding = Array.from( new Array(numCols), () => value );
      for( let y = 0 ; y < gridHeight ; y++ ) {
        grid[y].push(...padding);
      }
    } else if( numCols < 0 ) {
      for( let y = 0 ; y < gridHeight ; y++ ) {
        grid[y].splice(gridWidth + numCols - 1, -numCols);
      }
    }
    return grid;
  }
  static crop(grid, rimThickness=1, rimValue=0) {
    // the pad functions can also trim, if a negative padding value is supplied
    const leftMost = GridStuff.leftMost(grid, rimValue, true);
    const topMost = GridStuff.topMost(grid, rimValue, true);

    GridStuff.padTop(grid, rimThickness - topMost, rimValue);
    GridStuff.padLeft(grid, rimThickness - leftMost, rimValue);

    const bottomMost = GridStuff.bottomMost(grid, rimValue, true);
    const rightMost = GridStuff.rightMost(grid, rimValue, true);
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    GridStuff.padBottom(grid, bottomMost - gridHeight + rimThickness * 2, rimValue );
    GridStuff.padRight(grid, rightMost - gridWidth + rimThickness * 2, rimValue );

    return grid;
  }
  static cropable(grid, rimThickness=1, rimValue=0) {
    if( GridStuff.leftMost(grid, rimValue, true) != rimThickness ||
        GridStuff.topMost(grid, rimValue, true) != rimThickness ||
        GridStuff.bottomMost(grid, rimValue, true) != grid.length - rimThickness - 1 ||
        GridStuff.rightMost(grid, rimValue, true) != grid[0].length - rimThickness - 1 ) {
      return true;
    }
    return false;
  }
  static repaint(grid, valueCB) {
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;
    for( let y = 0; y < gridHeight; y++ ) {
      const row = grid[y];
      for( let x = 0; x < gridWidth; x++ ) {
        row[x] = valueCB(row[x]);
      }
    }
    return grid;
  }
}
