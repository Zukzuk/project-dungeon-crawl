import React from 'react';
import TileGridInfo from './TileGridInfo';
import Tile from './Tile';
import GridStuff from '../grid-stuff';

class TileGrid extends React.PureComponent {
  generateTileGrid() {
    const tiles = [];
    const grid = this.props.grid;
    const prevGrid = this.props.prevGrid;
    const tileStyles = ( prevGrid ? this.tileStyles(grid, prevGrid) : undefined );
    const width = grid[0].length;
    const height = grid.length;
    const style = {height: `${this.props.tileSize}px`};
    const cursor = this.props.cursor || [undefined, undefined];
    var textContent = "";
    const showGridValues = this.props.showGridValues;
    for( let y=0; y < height; y++ ) {
      let row = [];
      for( let x=0; x < width; x++ ) {
        var tProps = ( tileStyles ? tileStyles[y][x] : {} );
        if( this.props.showGridValues )
          textContent = grid[y][x];
        row.push(<Tile key={"tile" + x + "." + y}
                       size={this.props.tileSize}
                       tileNum={y*height+x}
                       bright={x % 2 ^ y % 2}
                       visible={tProps['visible']}
                       highlight={tProps['highlight']}
                       textContent={textContent}
                   />);
      }
      tiles.push(<div key={"row" + y} className="tileRow" style={style}>{row}</div>);
    }
    return <div className="tileGrid"><TileGridInfo gridInfo={this.props.gridInfo} />{tiles}</div>
  };
  tileStyles(grid, prevGrid) {
    const gridWidth = grid[0].length;
    const gridHeight = grid.length;
    const cursor = this.props.cursor || [];
    const tileProps = GridStuff.generateGrid(gridWidth, gridHeight, null);
    for( var y = 0, newRow, oldRow; y < gridHeight; y++ ) {
      newRow = grid[y];
      oldRow = prevGrid[y]
      for( var x = 0, newVal, oldVal, props; x < gridWidth; x++ ) {
        newVal = newRow[x];
        oldVal = oldRow[x];
        props = tileProps[y][x] = {};
        if( newVal != oldVal ) { // if the values differ
          if( oldVal !== 0 || newVal !== 0 ) // always draw a tile
            props['visible'] = true;
          if( newVal === 0 && oldVal !== 0 ) // strike it through if it was removed
            props['highlight'] = -1;
          else                               // or highlight it if it was created or modified
            props['highlight'] = 1;
        } else if( newVal !== 0 ) { // newVal == oldVal && newVal != 0
          props['visible'] = true;
        }
        if( cursor[0] === x && cursor[1] === y )
          props['highlight'] = 2;
      }
    }
    return tileProps;
  };
  render() {
    return this.generateTileGrid();
  };
};

export {TileGrid as default};
