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
    this.props.actions.GameMenu.updateLevel(8);
  }

  componentWillReceiveProps(nextProps) {
    this.updateDungeon(nextProps);
    this.updateRoomVisibility(nextProps);
  }

  updateDungeon(nextProps) {
    if (react.stateDidUpdate(this.props, nextProps, 'GameBoard.hasPerpective') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')) {
      this.calculateNewDungeon(nextProps);
    }
  }

  updateRoomVisibility(nextProps) {
    if (react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId')) {
      if (!isNaN(nextProps.state.Entity.Player.spawns[0].position.roomId)) this.setDungeon(nextProps);
    }
  }

  /* methods */

  calculateNewDungeon(props) {
    const {tileGrids, roomGrids} = dungeon.build(props);
    this.tileGrids = tileGrids;
    this.roomGrids = roomGrids;

    this.setDungeon(props);
  }

  getDungeonInstance(props) {
    const grids = this.tileGrids.reduce((result, grid) => {
      result.push(grid.map(tiles => tiles.map((tileProps, index) => {
        return (
          <TileContainer key={index}>
            <TileView {...tileProps}></TileView>
          </TileContainer>
        );
      })));
      return result;
    }, []);

    const roomId = props.state.Entity.Player.spawns[0].position.roomId;
    const renderRange = (!isNaN(roomId)) ? [roomId, roomId - 1, roomId + 1] : [];
    debugger;
    const instance = this.roomGrids.reduce((result, roomProps, index) => {
      const tiles = grids[index];
      debugger;
      if (renderRange.indexOf(index) !== -1) {
        result.push(
          <RoomContainer key={index}>
            <RoomView {...roomProps}>{tiles}</RoomView>
          </RoomContainer>
        );
      }
      return result;
    }, []);

    return instance;
  }

  /* local state */

  getDungeonProps(props) {
    return {
      state: props.state.GameBoard
    };
  }

  setDungeon(props) {
    this.setState({
      ...this.state,
      dungeonInstance: this.getDungeonInstance(props)
    });
  }

  /* render */

  render() {
    return (
      <DungeonView {...this.getDungeonProps(this.props)}>
        <CameraContainer>
          <div id='rooms'>{this.state.dungeonInstance}</div>
          <PlayerContainer/>
          {/*<MinionContainer />*/}
        </CameraContainer>
      </DungeonView>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'GameBoard', 'Tile', 'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, [
    'GameMenu', 'Tile', 'Entity'
  ])
)(DungeonContainer);
