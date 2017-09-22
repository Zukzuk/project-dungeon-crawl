import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {react, redux} from '../helpers/helpers';
import dungeon from '../helpers/dungeon';

import DungeonView from '../views/DungeonView';
import PlayerContainer from "./PlayerContainer";
import CameraContainer from "./CameraContainer";

class DungeonContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.state = {
      rooms: null
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
    this.setState({ ...this.state,
      rooms: dungeon.build(props)
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
