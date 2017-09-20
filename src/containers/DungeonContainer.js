import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {react, redux} from '../helpers/helpers';

import TileContainer from './TileContainer';
import TileView from '../views/TileView';
import RoomContainer from './RoomContainer';
import RoomView from '../views/RoomView';
import DungeonView from '../views/DungeonView';

import PlayerContainer from "./PlayerContainer";
import MinionContainer from "./MinionContainer";
import CameraContainer from "./CameraContainer";

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

class DungeonContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.state = {
      rooms: null
    }
  }

  componentDidMount() {
    this.props.actions.GameMenu.updateLevel(1);
  }

  /* update */

  getDungeonProps(props) {
    return {
      state: props.state.GameBoard
    };
  }

  updateDungeon(props) {
    const numOfTiles = Math.pow(2, props.state.GameBoard.level);
    // get squares of each grid as rectangles
    const rectangles = buildRectangles(numOfTiles, props.state.GameBoard.level);
    // build tile entities from tiled-rectangles
    const tileGrids = buildTileGrids(rectangles, props);
    // build room entities from grids
    const rooms = buildRooms(tileGrids, props);
    //update internal state
    this.setState({ ...this.state, rooms });
  }

  componentWillReceiveProps(nextProps) {
    if (
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.hasPerpective') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
      this.updateDungeon(nextProps);
    }
  }

  /* render */

  render() {
    return (
      <DungeonView {...this.getDungeonProps(this.props)}>
        <CameraContainer>
          <div className='rooms'>{ this.state.rooms }</div>
          <PlayerContainer/>
          {/*<MinionContainer />*/}
        </CameraContainer>
      </DungeonView>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'GameBoard', 'Tile'
  ]),
  dispatch => redux.mapActions(dispatch, [
    'GameMenu', 'Tile'
  ])
)(DungeonContainer);
