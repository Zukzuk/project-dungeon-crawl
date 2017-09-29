import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { _redux_, _react_ } from '../helpers/helpers';
import _collision_  from '../helpers/collision';
import DungeonContainer from './DungeonContainer';
import GameBoardView from '../views/GameBoardView';

class GameBoardContainer extends PureComponent {

  /* lifecycle */

  roomComponent = null;

  componentDidMount() {
    this.addKeyboardSupport();
  }

  componentWillReceiveProps(nextProps) {
    const _update_ = {props: this.props, contextName: this.constructor.name};
    this.updateRoomComponent({...nextProps, ...{ ..._update_, methodName: this.updateRoomComponent.name }});
  }

  updateRoomComponent(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'GameBoard.level') ||
      _react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].position.roomId')) {
      this.roomComponent = _collision_.resetCollision(this.roomComponent);
    }
  }

  /* methods */

  getRoomComponent(props) {
    const roomId = props.state.Entity.Player.spawns[0].position.roomId;
    const roomElm = document.querySelector(`#room${roomId}`);
    if (!isNaN(roomId) && roomElm) this.roomComponent = _react_.getComponent(roomElm);
  }

  addKeyboardSupport() {
    window.addEventListener('keydown', e => {
      if (e.defaultPrevented) return;
      e.preventDefault();
      let delta;
      switch (e.key) {
        case "ArrowDown":
          delta = {x: 0, y: 1};
          break;
        case "ArrowUp":
          delta = {x: 0, y: -1};
          break;
        case "ArrowLeft":
          delta = {x: -1, y: 0};
          break;
        case "ArrowRight":
          delta = {x: 1, y: 0};
          break;
        default:
          return; // Quit when this doesn't handle the key event.
      }
      const tileId = this.props.state.Entity.Player.spawns[0].position.tileId;
      const roomId = this.props.state.Entity.Player.spawns[0].position.roomId;
      if (!this.roomComponent) this.getRoomComponent(this.props);

      const index = _collision_.getTileIndex(this.roomComponent, tileId, delta);
      if (!isNaN(index)) this.props.actions.Tile.selectTile(index, roomId);
    }, true);
  }

  /* render */

  render() {
    return (
      <GameBoardView>
        <DungeonContainer />
      </GameBoardView>
    );
  }
}

export default connect(
  state => _redux_.mapState(state, [
    'Entity', 'GameBoard'
  ]),
  dispatch => _redux_.mapActions(dispatch, [
    'Tile'
  ])
)(GameBoardContainer);
