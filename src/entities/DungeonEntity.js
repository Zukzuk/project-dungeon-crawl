import React from 'react';
import EntityContainer from '../containers/EntityContainer';
import DungeonView from '../views/DungeonView';
import RoomView from '../views/RoomView';
import TileView from '../views/TileView';
import { math } from '../helpers/helpers';

const getTile = (props, index) => {
  const selectTile = () => props.actions.selectTile(index - 1);
  props.id = index - 1;
  return (
    <EntityContainer key={ index }>
      <TileView { ...props } onClick={ selectTile }/>
    </EntityContainer>
  )
};

const getRoom = (props, grid, index) => {
  props.id = index;
  return (
    <EntityContainer key={ index }>
      <RoomView { ...props }>{ grid }</RoomView>
    </EntityContainer>
  );
};

const getDungeon = rooms => {
  return (
    <EntityContainer>
      <DungeonView>{ rooms }</DungeonView>
    </EntityContainer>
  );
};

const getGrid = (props, room, gutter) => {
  const { rows, columns } = room;
  const tileProps = {
    style: {
      margin: `${gutter}px`,
      width: `calc(100% * (1/${columns}) - ${gutter * 2}px)`,
    },
    state: props.state.Tile,
    actions: props.actions.Tile
  };

  let y = 0, grid = [];
  while (y++ < rows) {
    let x = 0, row = [];
    while (x++ < columns) {
      let index = x + ((y-1)*columns);
      row.push(getTile(tileProps, index));
    }
    grid.push(row);
  }

  return grid;
};

const getLayout = (amount, level, min) => {
  const square = [Math.sqrt(amount), Math.sqrt(amount)];

  const getFactor = (number, middle = false) => {
    const factors = math.factors(number);
    // pick the most middle factorial
    if (middle) return factors[Math.floor(factors.length / 2)];
    return factors[Math.floor(Math.random() * factors.length)];
  };

  return square.reduce((result, side) => {
    let factor;
    if (!result.rows.length) {
      factor = (side <= min) ? 1 : getFactor(side, true);
      while (result.rows.length < factor) result.rows.push(side/factor);
    } else {
      result.rows.forEach(() => {
        let rects = [];
        factor = (side <= min) ? 1 : getFactor(side);
        const rows = result.rows[0];
        const columns = side/factor;
        while (rects.length < factor) rects.push({rows, columns, tiles: rows*columns} );
        result.rects = result.rects.concat(rects);
      });
    }
    return result;
  }, {rows: [], rects: []});
};

export default {
  create: props => {
    const numOfTiles = Math.pow(2, props.state.GameBoard.level);

    // get the layout of each grid as rectangles
    const layout = getLayout(numOfTiles, props.state.GameBoard.level, 4);

    // build grid entities from tiled-rectangles
    const grids = layout.rects.reduce((result, square) => {
      result.push(getGrid(props, square, props.state.Tile.gutter));
      return result;
    }, []);

    // build room entities from grids
    const rooms = grids.reduce((result, grid, i) => {
      const roomProps = {
        style: {
          width: `${props.state.Tile.width * grid.length}px`,
          height: `${props.state.Tile.height * grid[0].length}px`
        }
      };
      result.push(getRoom(roomProps, grid, i));
      return result;
    }, []);

    // build the dungeon from rooms
    return getDungeon(rooms);
  }
};