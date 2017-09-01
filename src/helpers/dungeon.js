import React from 'react';

import EntityContainer from '../containers/EntityContainer';
import DungeonView from '../views/DungeonView';
import RoomView from '../views/RoomView';
import TileView from '../views/TileView';

import { math } from '../helpers/helpers';

const getTile = (props, index) => {
  const selectTile = () => props.actions.selectTile(index - 1);
  return (
    <EntityContainer key={ index }>
      <TileView { ...props } onClick={ selectTile }/>
    </EntityContainer>
  )
};

const getRoom = (grid, index) => {
  return (
    <EntityContainer key={ index }>
      <RoomView>{ grid }</RoomView>
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

const getGrid = (props, room) => {
  const tileProps = {
    actions: props.actions.Tile
  };
  const { rows, columns } = room;

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
        let squares = [];
        factor = (side <= min) ? 1 : getFactor(side);
        const rows = result.rows[0];
        const columns = side/factor;
        while (squares.length < factor) squares.push({rows, columns, tiles: rows*columns} );
        result.squares = result.squares.concat(squares);
      });
    }
    debugger;
    return result;
  }, {rows: [], squares: []});
};

const setupDungeon = props => {
  const numOfTiles = Math.pow(2, props.state.GameBoard.level);
  const layout = getLayout(numOfTiles, props.state.GameBoard.level, 4);
  const grids = layout.squares.reduce((result, square) => {
    result.push(getGrid(props, square));
    return result;
  }, []);
  debugger;

  const rooms = grids.reduce((result, grid, i) => {
    result.push(getRoom(grid, i));
    return result;
  }, []);
  debugger;

  return getDungeon(rooms);
};

export default {
  create: props => setupDungeon(props)
};
