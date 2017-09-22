import React from 'react';
import {math} from './helpers';
import collision from './collision';
import TileContainer from '../containers/TileContainer';
import TileView from '../views/TileView';
import RoomContainer from '../containers/RoomContainer';
import RoomView from '../views/RoomView';

const getTileGrid = (props, rectangle, count, roomId) => {
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
        x,
        y,
        style: {
          margin: `${props.state.Tile.gutter}px`,
          width: `calc(100% * (1/${columns}) - ${props.state.Tile.gutter * 2}px)`,
        },
        onClick: selectTile
      };
      row.push(tileProps);
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
    result.push(getTileGrid(props, rectangle, tileCount, index));
    tileCount += (rectangle.columns * rectangle.rows);
    return result;
  }, []);
};

const getRoomGrid = (grids, props) => {
  var rooms = [];
  var mapSize = 0;
  for (let i = 0; i < grids.length; i++) {
    const tileGrid = grids[i];
    const room = {};
    const lastRoom = _.get(rooms, 'length') ? rooms[i - 1] : {w: 0, h: 0};
    room.id = i;

    room.w = props.state.Tile.size * tileGrid[0].length;
    room.h = props.state.Tile.size * tileGrid.length;
    mapSize = Math.max(lastRoom.w + (room.w * 3), lastRoom.h + (room.h * 3));

    room.x = math.rand(0, mapSize - room.w);
    room.y = math.rand(0, mapSize - room.h);

    if (collision.roomCollision(room, rooms)) {
      i--;
      continue;
    }

    rooms.push(room);
  }
  rooms = collision.roomSquash(rooms, collision.roomCollision);

  return rooms;
};

const createInstance = (tileGrids, roomGrids) => {
  const grids = tileGrids.reduce((result, grid) => {
    result.push(grid.map(tiles => tiles.map((props, index) => {
      return (
        <TileContainer key={index}>
          <TileView {...props}></TileView>
        </TileContainer>
      );
    })));
    return result;
  }, []);
  return roomGrids.reduce((result, room, index) => {
    const roomProps = {
      id: index,
      style: {
        left: `${room.x}px`,
        top: `${room.y}px`,
        width: `${room.w}px`,
        height: `${room.h}px`
      }
    };
    result.push(
      <RoomContainer key={index}>
        <RoomView {...roomProps}>{grids[index]}</RoomView>
      </RoomContainer>
    );
    return result;
  }, []);
};

export default {
  build: props => {
    const numOfTiles = Math.pow(2, props.state.GameBoard.level);
    // get rectangles of each grid
    const rectangles = buildRectangles(numOfTiles, props.state.GameBoard.level);
    // get tilegrids from rectangles
    const tileGrids = buildTileGrids(rectangles, props);
    // get rooms from grids
    const roomGrids = getRoomGrid(tileGrids, props);
    // create component instances
    return createInstance(tileGrids, roomGrids);
    debugger;
  }
};
