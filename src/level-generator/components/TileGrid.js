import React from 'react';
import TileGridInfo from './TileGridInfo';
import Tile from './Tile';
import GridStuff from '../grid-stuff';

class TileGrid extends React.PureComponent {
  generateTileGrid() {
    const tiles = [];
    const props = this.props;
    const {grid, prevGrid, gridInfo, spawnIndex = {}, tileSize, showGridValues, cursor = [undefined, undefined]} = props;
    const tileStyles = ( prevGrid ? this.tileStyles(grid, prevGrid) : undefined );
    const width = grid[0].length;
    const height = grid.length;
    const style = {height: `${props.tileSize}px`};
    let textContent = "";
    for( let y=0; y < height; y++ ) {
      let row = [];
      for( let x=0; x < width; x++ ) {
        let tProps = ( tileStyles && tileStyles[y] && tileStyles[y][x] ? tileStyles[y][x] : {} );
        let monster = (spawnIndex[y]||{})[x]; // results in monster name or undefined
        if( showGridValues )
          textContent = grid[y][x];
        row.push(<Tile key={"tile" + x + "." + y}
                       size={tileSize}
                       tileNum={y*height+x}
                       bright={x % 2 ^ y % 2}
                       visible={tProps['visible']}
                       highlight={tProps['highlight']}
                       textContent={textContent}
                       monster={monster}
                   />);
      }
      tiles.push(<div key={"row" + y} className="tileRow" style={style}>{row}</div>);
    }
    return <div className="tileGrid"><TileGridInfo gridInfo={gridInfo} />{tiles}</div> ;
  }
  tileStyles(grid, prevGrid) {
    const gridWidth = Math.min(grid[0].length, prevGrid[0].length);
    const gridHeight = Math.min(grid.length, prevGrid.length);
    const cursor = this.props.cursor || [];
    const tileProps = GridStuff.generateGrid(gridWidth, gridHeight, null);
    // Determine stile per tile, comparing old grid with new grid
    for( let y = 0, newRow, oldRow; y < gridHeight; y++ ) {
      newRow = grid[y];
      oldRow = prevGrid[y];
      for( let x = 0, newVal, oldVal, props; x < gridWidth; x++ ) {
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
  }
  render() {
    return this.generateTileGrid();
  }
}

export {TileGrid as default};
