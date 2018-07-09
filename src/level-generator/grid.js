export default class Grid {
  static gridFromArray(arr, width) {
    if( ! width )
      throw 'gridFromArray: Width parameter not defined or zero';
    let grid = [];
    for( let i=0, len=arr.length; i < len; i+=width) {
      grid.push(arr.slice(i, width + i));
    }
    const newGrid = new Grid(grid[0].length, grid.length);
    newGrid.rawGrid = grid;
    return newGrid;
  }

  constructor(width = 50, height = 50, value = 0) {
    this.initialWidth = width;
    this.initialHeight = height;
//    const rowTempl = Array.apply(null, Array(width)).map( () => value );
//    this.rawGrid = Array.apply(null, Array(height)).map( () => rowTempl.slice() );
    this.rawGrid = Array.from(new Array(height),
                              () => Array.from(new Array(width), () => value )
                   );
  }
  width() {
    return this.rawGrid[0].length;
  }
  height() {
    return this.rawGrid.length;
  }
  sumGrid() {
    return this.rawGrid.map( (line) => line.reduce( (a,b) => a+b ) ).reduce( (a,b) => a+b );
  }
  countNonZero() {
    let count = 0;
    const rawGrid = this.rawGrid;
    const width = rawGrid[0].length;
    for( let y=0, row; ( row = rawGrid[y] ) ; y++ ) {
      for( let x=0; x < width; x++ ) {
        if( row[x] )
          count++;
      }
    }
    return count;
  }
  countValue(value) {
    let count = 0;
    const width = this.rawGrid[0].length;
    for( let y=0, row; ( row = this.rawGrid[y] ) ; y++ ) {
      for( let x=0; x < width; x++ ) {
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
    return Array.prototype.concat.apply([], this.rawGrid);
  }
  drawRoom(room, position, roomID = 1) {
    const rawGrid = this.rawGrid;
    const [xPos, yPos] = position;
    const [roomWidth, roomHeight] = room;
    for( let y = 0, gridLine; y < roomHeight; y++ ) {
      gridLine = rawGrid[y+yPos];
      for( let x = 0; x < roomWidth; x++ ) {
        gridLine[x+xPos] = roomID;
      }
    }
  }
  moveTiles(tiles, direction) {
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
    const rawGrid = this.rawGrid;
    const gridWidth = rawGrid[0].length;
    const gridHeight = rawGrid.length;
    tiles = tiles.slice().sort(boundSortFunc);
    for( let i=tiles.length; i--; ) {
      let [x, y] = tiles[i];
      let row = rawGrid[y];
      let newX = x + xDirection;
      let newY = y + yDirection;
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
  // crop(rimThickness = 1, rimValue = 0) {
  //   //GridStuff.crop(this.rawGrid, rimThickness, rimValue);
  //   GridStuff.crop(this.rawGrid, rimThickness, rimValue);
  //   this.width = this.rawGrid[0].length;
  //   this.height = this.rawGrid.length;
  // }
  leftMost(value=0, negate=true) {
    // look for the left most tile matching value, or not matching value if negated
    // return the column number
    const grid = this.rawGrid;
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
  rightMost(value=0, negate=true) {
    // look for the right most tile matching value, or not matching value if negated
    // return the column number
    const grid = this.rawGrid;
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
  topMost(value=0, negate=true) {
    // look for the top most tile matching value, or not matching value if negated
    // return the row number
    const grid = this.rawGrid;
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
  bottomMost(value=0, negate=true) {
    // look for the top most tile matching value, or not matching value if negated
    // return the row number
    const grid = this.rawGrid;
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
  padTop(numRows, value = 0) {
    // positive numRows adds rows, negative numRows removes rows
    const grid = this.rawGrid;
    const gridWidth = grid[0].length;
    if( numRows > 0 ) {
      const padding = Array.from( new Array(numRows), () => Array.from( new Array(gridWidth), () => value ) );
      grid.splice(0, 0, ...padding);
    } else if ( numRows < 0 ) {
      grid.splice(0, -numRows);
    }
    return grid;
  }
  padBottom(numRows, value = 0) {
    // positive numRows adds rows, negative numRows removes rows
    const grid = this.rawGrid;
    if( numRows > 0 ) {
      const gridWidth = grid[0].length;
      const padding = Array.from( new Array(numRows), () => Array.from( new Array(gridWidth), () => value ) );
      grid.push(...padding);
    } else if ( numRows < 0 ) {
      grid.splice(grid.length + numRows - 1, -numRows);
    }
    return grid;
  }
  padLeft(numCols, value = 0) {
    // positive numCols adds cols, negative numCols removes cols
    const grid = this.rawGrid;
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
  padRight(numCols, value = 0) {
    // positive numCols adds cols, negative numCols removes cols
    const grid = this.rawGrid;
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
  crop(rimThickness=1, rimValue=0) {
    // the pad functions can also trim, if a negative padding value is supplied
    const grid = this.rawGrid;
    const leftMost = this.leftMost(rimValue, true);
    const topMost = this.topMost(rimValue, true);

    this.padTop(rimThickness - topMost, rimValue);
    this.padLeft(rimThickness - leftMost, rimValue);

    const bottomMost = this.bottomMost(rimValue, true);
    const rightMost = this.rightMost(rimValue, true);
    const gridHeight = grid.length;
    const gridWidth = grid[0].length;

    this.padBottom(bottomMost - gridHeight + rimThickness * 2, rimValue );
    this.padRight(rightMost - gridWidth + rimThickness * 2, rimValue );

    return grid;
  }
  cropable(rimThickness = 1, rimValue = 0) {
    if( this.leftMost(rimValue, true) != rimThickness ||
        this.topMost(rimValue, true) != rimThickness ||
        this.bottomMost(rimValue, true) != this.height() - rimThickness - 1 ||
        this.rightMost(rimValue, true) != this.width() - rimThickness - 1 ) {
      return true;
    }
    return false;
  }
  repaint(valueCB) {
    const grid = this.rawGrid;
    const gridHeight = this.rawGrid.length;
    const gridWidth = this.rawGrid[0].length;
    for( let y = 0; y < gridHeight; y++ ) {
      const row = grid[y];
      for( let x = 0; x < gridWidth; x++ ) {
        row[x] = valueCB(row[x]);
      }
    }
    return this;
  }
}
