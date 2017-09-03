import React from 'react';
import { dom } from '../helpers/helpers';
import EntityContainer from '../containers/EntityContainer';
import DungeonView from '../views/DungeonView';
import RoomEntity from '../entities/RoomEntity';
import TileEntity from '../entities/TileEntity';
import {
  ENTITY_CONSTANTS
} from '../constants';

const getGrid = (props, rectangle, count) => {
  const { rows, columns } = rectangle;
  let y = 0, grid = [];
  while (y++ < rows) {
    let x = 0, row = [];
    while (x++ < columns) {
      let index = x + ((y-1)*columns);
      row.push(TileEntity.create(props, count + index));
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
  };
  return arr;
};

const buildSquares = (amount, level) => {
  if (amount === 2) return [{ width: 2, height: [1] }]; // columns -> rows -> length

  const isEven = (level % 2 === 0);
  const mainWidth = isEven ? Math.sqrt(amount) : Math.sqrt(amount*2);
  const mainHeight = isEven ? Math.sqrt(amount) : Math.sqrt(amount*.5);

  const min = 4;
  const max = (mainWidth/2 > min) ? (mainWidth/2 < 512) ? mainWidth/2 : 512 : min;

  const columns = getSlices(mainWidth, min, max);

  const columnsAndRows = columns.reduce((result, colWidth) => {
    result.push({
      width: colWidth,
      heights: getSlices(mainHeight, min, max)
    });
    return result;
  }, []);

  const squares = columnsAndRows.reduce((result, slice) => {
    const _squares = slice.heights.reduce((_result, height) => {
      _result.push({
        columns: slice.width,
        rows: height
      });
      return _result;
    }, []);
    result = result.concat(_squares);
    return result;
  }, []);

  return squares;
};

const buildTileGrids = (rectangles, props) => {
  let tileCount = 0;
  return rectangles.reduce((result, rectangle) => {
    const tileProps = {
      style: {
        margin: `${props.state.Tile.gutter}px`,
        width: `calc(100% * (1/${rectangle.columns}) - ${props.state.Tile.gutter * 2}px)`,
      },
      state: props.state.Tile,
      actions: props.actions.Tile
    };
    result.push(getGrid(tileProps, rectangle, tileCount));
    tileCount += (rectangle.columns * rectangle.rows);
    return result;
  }, []);
};

const buildRooms = (grids, props) => {
  let offsetLeft = 0;
  return grids.reduce((result, tileGrid, i) => {
    const roomProps = {
      style: {
        left: `${offsetLeft}px`,
        width: `${props.state.Tile.width * tileGrid[0].length}px`,
        height: `${props.state.Tile.height * tileGrid.length}px`
      }
    };
    result.push(RoomEntity.create(roomProps, tileGrid, i));
    offsetLeft += (props.state.Tile.width * (grids[i][0].length + 1));
    return result;
  }, []);
};

const buildDungeon = (props, rooms, entities) => {
  const dungeonProps = {
    state: props.state.GameBoard
  };
  return (
    <EntityContainer>
      <DungeonView { ...dungeonProps }>
        { rooms }
        { entities }
      </DungeonView>
    </EntityContainer>
  );
};

const updatePerspective = ({hasPerspective}) => {
  dom.setClassList({
    nodes: dom.toArray(document.querySelector('#dungeon')),
    names: 'perspective',
    addif: hasPerspective
  });
};

export default {
  create: (props, entities) => {
    const numOfTiles = Math.pow(2, props.state.GameBoard.level);

    // get squares of each grid as rectangles
    const rectangles = buildSquares(numOfTiles, props.state.GameBoard.level);

    // build tile entities from tiled-rectangles
    const tileGrids = buildTileGrids(rectangles, props);

    // build room entities from grids
    const rooms = buildRooms(tileGrids, props);

    // build the dungeon from rooms
    return buildDungeon(props, rooms, entities);
  },

  mount: (entity, childProps) => {
    dom.optimizedResize();
    updatePerspective({ ...childProps.state });
  },

  update: (entity, childProps, event) => {
    switch (event.lastEvent) {
      case ENTITY_CONSTANTS.ENTITY_OFFSET_PREPARE:
        return updatePerspective({ ...childProps.state });
    }
  }
};
