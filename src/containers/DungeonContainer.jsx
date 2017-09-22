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

  /* local state */

  getDungeonProps(props) {
    return {
      state: props.state.GameBoard
    };
  }

  getDungeonInstance(tileGrids, roomGrids, props) {
    const grids = tileGrids.reduce((result, grid) => {
      result.push(grid.map(tiles => tiles.map((tileProps, index) => {
        return (
          <TileContainer key={index}>
            <TileView {...tileProps}></TileView>
          </TileContainer>
        );
      })));
      return result;
    }, []);

    const instance = roomGrids.reduce((result, roomProps, index) => {
      const tiles = grids[index];
      if (props.state.Entity.Player.spawns[0].position.roomId === index) {
        result.push(
          <RoomContainer key={index}>
            <RoomView {...roomProps}>{tiles}</RoomView>
          </RoomContainer>
        );
      }
      return result;
    }, []);

    this.tileGrids = tileGrids;
    this.roomGrids = roomGrids;

    return instance;
  }

  setNewDungeon(props) {
    const {tileGrids, roomGrids} = dungeon.build(props);

    this.setState({...this.state,
      dungeonInstance: this.getDungeonInstance(tileGrids, roomGrids, props)
    });
  }

  refreshDungeon(props) {
    this.setState({...this.state,
      dungeonInstance: this.getDungeonInstance(this.tileGrids, this.roomGrids, props)
    });
  }

  /* updates */

  updateDungeon(nextProps) {
    if (react.stateDidUpdate(this.props, nextProps, 'GameBoard.hasPerpective') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')) {
      this.setNewDungeon(nextProps);
    }
  }

  updateRoomVisibility(nextProps) {
    if (react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId')) {
      if (!isNaN(nextProps.state.Entity.Player.spawns[0].position.roomId)) this.refreshDungeon(nextProps);
    }
  }

  /* render */

  render() {
    return (
      <DungeonView {...this.getDungeonProps(this.props)}>
        <CameraContainer>
          <div className='rooms'>{ this.state.dungeonInstance }</div>
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
