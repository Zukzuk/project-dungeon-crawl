

class GridStuff {
  static generateGrid(width, height, value = 0) {
    const rowTempl = Array.apply(null, Array(width)).map( () => value );
    return Array.apply(null, Array(height)).map( () => rowTempl.slice() );
  }
  static sumGrid(grid) {
    return grid.map( (line) => line.reduce( (a,b) => a+b ) ).reduce( (a,b) => a+b );
  }

}

export {GridStuff as default};
