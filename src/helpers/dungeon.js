import React from 'react';
import TileContainer from '../containers/TileContainer';
import TileView from '../views/TileView';
import RoomContainer from '../containers/RoomContainer';
import RoomView from '../views/RoomView';

const getGrid = (props, rectangle, count, roomId) => {
  const {rows, columns} = rectangle;
  let y = 0, grid = [];
  while (y++ < rows) {
    let x = 0, row = [];
    while (x++ < columns) {
      let index = x + ((y - 1) * columns);
      const tileId = count + index - 1;
      const selectTile = () => props.actions.Tile.selectTile(tileId, roomId);
      const tileProps = {
        id: tileId,
        column: x,
        row: y,
        style: {
          margin: `${props.state.Tile.gutter}px`,
          width: `calc(100% * (1/${columns}) - ${props.state.Tile.gutter * 2}px)`,
        },
        onClick: selectTile
      };
      row.push(
        <TileContainer key={index}>
          <TileView {...tileProps}/>
        </TileContainer>
      );
    }
    grid.push(row);
  }
  return grid;
};

const getSlices = (count, min, max, arr = []) => {
  while (count) {
    let width = Math.floor(Math.random() * (max - min + 1)) + min;
    width = (count - width < min) ? count : width;
    arr.push(width);
    count -= width;
  }
  return arr;
};

const buildRectangles = (amount, level) => {
  if (level === 1) return [{columns: 2, rows: [1]}]; // columns -> rows -> length

  const isEven = (level % 2 === 0);
  const mainWidth = isEven ? Math.sqrt(amount) : Math.sqrt(amount * 2);
  const mainHeight = isEven ? Math.sqrt(amount) : Math.sqrt(amount * .5);

  const min = 4;
  const max = (mainWidth / 2 > min) ? (mainWidth / 2 < 512) ? mainWidth / 2 : 512 : min;

  const columns = getSlices(mainWidth, min, max);

  const columnsAndRows = columns.reduce((result, colWidth) => {
    result.push({
      width: colWidth,
      heights: getSlices(mainHeight, min, max)
    });
    return result;
  }, []);

  const rectangles = columnsAndRows.reduce((result, slice) => {
    const _rectangles = slice.heights.reduce((_result, height) => {
      _result.push({
        columns: slice.width,
        rows: height
      });
      return _result;
    }, []);
    result = result.concat(_rectangles);
    return result;
  }, []);

  return rectangles;
};

const buildTileGrids = (rectangles, props) => {
  let tileCount = 0;
  return rectangles.reduce((result, rectangle, index) => {
    result.push(getGrid(props, rectangle, tileCount, index));
    tileCount += (rectangle.columns * rectangle.rows);
    return result;
  }, []);
};

const buildRooms = (grids, props) => {
  let offsetLeft = 0;
  return grids.reduce((result, tileGrid, index) => {
    const roomProps = {
      id: index,
      style: {
        left: `${offsetLeft}px`,
        width: `${props.state.Tile.size * tileGrid[0].length}px`,
        height: `${props.state.Tile.size * tileGrid.length}px`
      }
    };
    result.push(
      <RoomContainer key={index}>
        <RoomView {...roomProps}>{tileGrid}</RoomView>
      </RoomContainer>
    );
    offsetLeft += (props.state.Tile.size * (grids[index][0].length + 1));
    return result;
  }, []);
};



export default {
  build: props => {
    const numOfTiles = Math.pow(2, props.state.GameBoard.level);
    // get squares of each grid as rectangles
    const rectangles = buildRectangles(numOfTiles, props.state.GameBoard.level);
    // build tile entities from tiled-rectangles
    const tileGrids = buildTileGrids(rectangles, props);
    // build room entities from grids
    return buildRooms(tileGrids, props);
  }
};