import React from 'react';
import { _math_ } from './helpers';
import _collision_ from './collision';

const getTileGrid = (rectangle, count, roomId) => {
  const {rows, columns} = rectangle;
  let y = 0, grid = [];
  while (y++ < rows) {
    let x = 0, row = [];
    while (x++ < columns) {
      const index = x + ((y - 1) * columns);
      const tileId = count + index - 1;
      const tileProps = { id: tileId, roomId, x, y, columns, rows };
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

const buildTileGrids = level => {
  const numOfTiles = Math.pow(2, level);
  if (level === 1) return [{columns: 2, rows: [1]}]; // columns -> rows -> length

  const isEven = (level % 2 === 0);
  const mainWidth = isEven ? Math.sqrt(numOfTiles) : Math.sqrt(numOfTiles * 2);
  const mainHeight = isEven ? Math.sqrt(numOfTiles) : Math.sqrt(numOfTiles * .5);

  const min = 4;
  const max = (mainWidth / 2 > min) ? (mainWidth / 2 < 512) ? mainWidth / 2 : 512 : min;

  const columns = getSlices(mainWidth, min, max);

  const columnsAndRows = columns.reduce((result, colWidth) => {
    result.push({width: colWidth, heights: getSlices(mainHeight, min, max)});
    return result;
  }, []);

  const rectangles = columnsAndRows.reduce((result, slice) => {
    const _rectangles = slice.heights.reduce((_result, height) => {
      _result.push({columns: slice.width, rows: height});
      return _result;
    }, []);
    result = result.concat(_rectangles);
    return result;
  }, []);

  let tileCount = 0;
  return rectangles.reduce((result, rectangle, index) => {
    result.push(getTileGrid(rectangle, tileCount, index));
    tileCount += (rectangle.columns * rectangle.rows);
    return result;
  }, []);
};

const buildRoomGrid = (tileSize, grids) => {
  const rooms = [];
  let mapSize = 0;

  for (let i = 0; i < grids.length; i++) {
    const tileGrid = grids[i];
    const room = {};

    room.id = i;
    room.w = tileSize * tileGrid[0].length;
    room.h = tileSize * tileGrid.length;
    mapSize = Math.max(mapSize + (room.w * 3), mapSize + (room.h * 3));
    const roomX = _math_.rand(0, mapSize - room.w);
    const roomY = _math_.rand(0, mapSize - room.h);
    room.x = roomX + (tileSize - (roomX % tileSize));
    room.y = roomY + (tileSize - (roomY % tileSize));
    if (_collision_.roomCollision(room, rooms)) {
      i--;
      continue;
    }
    rooms.push(room);
  }

  _collision_.roomSquash(rooms, tileSize);

  return rooms.map(room => {
    room.style = {
      left: `${room.x}px`,
      top: `${room.y}px`,
      width: `${room.w}px`,
      height: `${room.h}px`
    };
    return room;
  });
};

export default {
  build: (level, tileSize) => {
    // get tilegrids from rectangles
    const tileGrids = buildTileGrids(level);
    // get rooms from grids
    const roomGrids = buildRoomGrid(tileSize, tileGrids);
    return {tileGrids, roomGrids}
  }
};
