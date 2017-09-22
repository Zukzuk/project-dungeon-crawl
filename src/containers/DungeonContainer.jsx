import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {react, redux} from '../helpers/helpers';
import dungeon from '../helpers/dungeon';

import DungeonView from '../views/DungeonView';
import RoomContainer from '../containers/RoomContainer';
import RoomView from '../views/RoomView';
import TileContainer from '../containers/TileContainer';
import TileView from '../views/TileView';

import CameraContainer from "./CameraContainer";

import PlayerContainer from "./PlayerContainer";

class DungeonContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.state = {
      dungeonInstance: null
    }
  }

  componentDidMount() {
    this.props.actions.GameMenu.updateLevel(7);
  }

  componentWillReceiveProps(nextProps) {
    this.setDungeon(nextProps);
  }

  /* local state */

  getDungeonProps(props) {
    return {
      state: props.state.GameBoard
    };
  }

  getDungeonRooms(props) {
    const {tileGrids, roomGrids} = dungeon.build(props);

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

    const dungeonInstance = roomGrids.reduce((result, props, index) => {
      const tiles = grids[index];
      result.push(
        <RoomContainer key={index}>
          <RoomView {...props}>{tiles}</RoomView>
        </RoomContainer>
      );
      return result;
    }, []);

    this.setState({...this.state,
      dungeonInstance
    });
  }

  /* updates */

  setDungeon(nextProps) {
    if (
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.hasPerpective') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
      this.getDungeonRooms(nextProps);
    }
  }

  /* render */

  render() {
    return (
      <DungeonView {...this.getDungeonProps(this.props)}>
        <CameraContainer>
          <div className='rooms'>{this.state.dungeonInstance}</div>
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
