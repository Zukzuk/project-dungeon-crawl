import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {redux, dom} from '../helpers/helpers';
import TileContainer from './TileContainer';
import TileView from '../views/TileView';
import RoomContainer from './RoomContainer';
import RoomView from '../views/RoomView';
import DungeonView from '../views/DungeonView';
import TileActions from '../redux/actions/TileActions';
import PlayerContainer from "./PlayerContainer";
import MinionContainer from "./MinionContainer";

const getGrid = (props, rectangle, count) => {
  const {rows, columns} = rectangle;
  let y = 0, grid = [];
  while (y++ < rows) {
    let x = 0, row = [];
    while (x++ < columns) {
      let index = x + ((y - 1) * columns);
      const tileProps = {
        id: count + index - 1,
        column: x,
        row: y,
        style: {
          margin: `${props.state.Tile.gutter}px`,
          width: `calc(100% * (1/${columns}) - ${props.state.Tile.gutter * 2}px)`,
        }
      };
      const selectTile = () => props.actions.Tile.selectTile(tileProps.id);
      row.push(
        <TileContainer key={index}>
          <TileView {...tileProps} onClick={selectTile}/>
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
  if (level === 1) return [{width: 2, height: [1]}]; // columns -> rows -> length

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
  return rectangles.reduce((result, rectangle) => {
    result.push(getGrid(props, rectangle, tileCount));
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
        width: `${props.state.Tile.width * tileGrid[0].length}px`,
        height: `${props.state.Tile.height * tileGrid.length}px`
      }
    };
    result.push(
      <RoomContainer key={ index }>
        <RoomView { ...roomProps }>{ tileGrid }</RoomView>
      </RoomContainer>
    );
    offsetLeft += (props.state.Tile.width * (grids[index][0].length + 1));
    return result;
  }, []);
};

class DungeonContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    const numOfTiles = Math.pow(2, props.state.GameBoard.level);

    // get squares of each grid as rectangles
    const rectangles = buildRectangles(numOfTiles, props.state.GameBoard.level);

    // build tile entities from tiled-rectangles
    const tileGrids = buildTileGrids(rectangles, props);

    // build room entities from grids
    this.rooms = buildRooms(tileGrids, props);
  };

  componentDidMount = () => {
    this.view = document.querySelector('#dungeon');
    this.updatePerspective({...this.props.state.GameBoard});
  };

  componentWillReceiveProps = nextProps => {
    this.updatePerspective({...nextProps.state.GameBoard});
  };

  /* updates */

  updatePerspective = ({hasPerspective}) => {
    dom.setClassList({
      nodes: dom.toArray(this.view),
      names: 'perspective',
      addif: hasPerspective
    });
  };

  /* render */

  render = () => {
    return (
      <DungeonView>
        <div className='rooms'>{ this.rooms }</div>
        <PlayerContainer />
        <MinionContainer />
      </DungeonView>
    );
  };
}

export default connect(
  state => redux.mapState(state, [
    'GameBoard',
    'Tile',
  ]),
  dispatch => redux.mapActions(dispatch, {
    Tile: TileActions,
  })
)(DungeonContainer);
