import React from 'react';
import TileGridInfo from './TileGridInfo';
import Tile from './Tile';

class TileGrid extends React.PureComponent {
  generateTileGrid() {
    const tiles = [];
    const grid = this.props.grid;
    const width = grid[0].length;
    const height = grid.length;
    const cursor = this.props.cursor || [undefined, undefined];
    for( let y=0; y < height; y++ ) {
      let row = [];
      for( let x=0; x < width; x++ ) {
        row.push(<Tile key={"tile" + x + "." + y} size={this.props.tileSize} tileNum={y*height+x} bright={x % 2 ^ y % 2} highlight={grid[y][x]+(cursor[0]==x&&cursor[1]==y)} />);
      }
      tiles.push(<div key={"row" + y} className="tileRow">{row}</div>);
    }
    return <div className="tileGrid"><TileGridInfo gridInfo={this.props.gridInfo} />{tiles}</div>
  };
  render() {
    return this.generateTileGrid();
  };
};

export {TileGrid as default};
