import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {_react_, _redux_} from '../helpers/helpers';
import _collision_ from '../helpers/collision';
import _offset_ from '../helpers/offset';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  roomComponent = null;
  state = {
    playerProps: null,
    lightRadiusProps: null
  };

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.Tile.selectTile(0, 0);
      this.props.actions.Player.updateLightRadius(4);
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    const _update_ = {props: this.props, contextName: this.constructor.name};
    this.updatePlayerPosition({...nextProps, ...{ ..._update_, methodName: this.updatePlayerPosition.name }});
    this.updateTileCollision({...nextProps, ...{ ..._update_, methodName: this.updateTileCollision.name }});
    this.updatePlayerOffset({...nextProps, ...{ ..._update_, methodName: this.updatePlayerOffset.name }});
  }

  updatePlayerPosition(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'Tile.tileId') ||
      _react_.stateDidUpdate(nextProps, 'Tile.roomId')) {
      this.props.actions.Player.updatePosition();
    }
  }

  updateTileCollision(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'GameBoard.level')) {
      // reset and recalculate collisions on level change
      this.roomComponent = _collision_.resetCollision(this.roomComponent);
      const tileId = _.get(nextProps, 'state.Entity.Player.spawns[0].position.tileId');
      if (tileId === 0) {
        this.calculateTileCollision(nextProps);
      } else if (tileId !== undefined) {
        this.props.actions.Tile.selectTile(0, 0);
      }
    } else if (_react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].position.roomId')) {
      // reset and recalculate collisions on room change
      this.roomComponent = _collision_.resetCollision(this.roomComponent);
      this.calculateTileCollision(nextProps);
    } else if (_react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      _react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].lightRadius')) {
      // recalculate collisions on tile or radius change
      this.calculateTileCollision(nextProps);
    }
  }

  updatePlayerOffset(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      _react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].position.roomId') ||
      _react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].lightRadius') ||
      _react_.stateDidUpdate(nextProps, 'GameBoard.hasPerspective') ||
      _react_.stateDidUpdate(nextProps, 'GameBoard.level')) {
      this.calculatePlayerOffset(nextProps);
    }
  }

  /* methods */

  getRoomComponent(props) {
    const roomId = props.state.Entity.Player.spawns[0].position.roomId;
    const roomElm = document.querySelector(`#room${roomId}`);
    if (!isNaN(roomId) && roomElm) this.roomComponent = _react_.getComponent(roomElm);
  }

  calculateTileCollision(props) {
    if (!this.roomComponent) this.getRoomComponent(props);

    _collision_.tileCollision(
      this.roomComponent,
      props.state.Entity.Player.spawns[0].position.tileId,
      props.state.Entity.Player.spawns[0].lightRadius,
      props.state.Tile.size
    );
  }

  calculatePlayerOffset(props) {
    if (!this.roomComponent) this.getRoomComponent(props);

    const tileId = props.state.Entity.Player.spawns[0].position.tileId;
    if (!isNaN(tileId)) {
      const style = _offset_.playerOffset(this.roomComponent, props);
      const lightRadiusStyle = _offset_.lightRadiusOffset(this.roomComponent, props);
      this.setPlayerProps(style, lightRadiusStyle);
    }
  }

  /* local state */

  setPlayerProps(style, lightRadiusStyle) {
    this.setState({
      ...this.state,
      playerProps: {
        style, id: 0
      },
      lightRadiusProps: {
        style: lightRadiusStyle
      }
    });
  }

  /* render */

  render() {
    return (
      <div className="player">
        <PlayerView {...this.state.playerProps} />
        {/*<LightRadiusView {...this.state.lightRadiusProps} />*/}
      </div>
    );
  }
}

export default connect(
  state => _redux_.mapState(state, [
    'Entity', 'Tile', 'GameBoard',
  ]),
  dispatch => _redux_.mapActions(dispatch, [
    'Entity', 'Player', 'Tile'
  ])
)(PlayerContainer);
