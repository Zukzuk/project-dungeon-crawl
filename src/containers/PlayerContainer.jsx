import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {dom, react, redux} from '../helpers/helpers';
import collision from '../helpers/collision';
import offset from '../helpers/offset';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.roomComponent = null;
    this.state = {
      playerProps: null,
      lightRadiusProps: null
    }
  }

  componentDidMount() {
    this.addKeyboardSupport();

    setTimeout(() => {
      this.props.actions.Tile.selectTile(0, 0);
      this.props.actions.Player.updateLightRadius(4);
    }, 1000);
  }

  componentWillReceiveProps(nextProps) {
    this.setPlayerPosition(nextProps);
    this.setTileCollision(nextProps);
    this.setPlayerOffset(nextProps);
  }

  /* local state */

  getPlayerProps(style, lightRadiusStyle) {
    this.setState({
      ...this.state,
      playerProps: {
        style,
        id: 0
      },
      lightRadiusProps: {
        style: lightRadiusStyle
      }
    });
  }

  /* methods */

  addKeyboardSupport() {
    window.addEventListener('keydown', e => {
      if (e.defaultPrevented) return;
      e.preventDefault();

      const index = collision.getTileIndex(
        this.roomComponent,
        this.props.state.Entity.Player.spawns[0].position.tileId,
        e.key
      );
      debugger;
      if (!isNaN(index)) this.props.actions.Tile.selectTile(
        index,
        this.props.state.Entity.Player.spawns[0].position.roomId
      );
    }, true);
  }

  getRoomComponent(props) {
    const roomId = props.state.Entity.Player.spawns[0].position.roomId;
    const roomElm = document.querySelector(`#room${roomId}`);
    if (!isNaN(roomId) && roomElm) this.roomComponent = dom.getComponent(roomElm);
  }

  calculateTileCollision(props) {
    if (!this.roomComponent) this.getRoomComponent(props);

    collision.tileCollision(
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
      const style = offset.playerOffset(this.roomComponent, props);
      const lightRadiusStyle = offset.lightRadiusOffset(this.roomComponent, props);
      this.getPlayerProps(style, lightRadiusStyle);
    }
  }

  /* updates */

  setPlayerPosition(nextProps) {
    if (
      react.stateDidUpdate(this.props, nextProps, 'Tile.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Tile.roomId')
    ) {
      this.props.actions.Player.updatePosition();
    }
  }

  setTileCollision(nextProps) {
    if (react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')) {
      // reset and recalculate collisions on level change
      this.roomComponent = collision.resetCollision(this.roomComponent);
      if (
        nextProps.state.Entity.Player.spawns[0].position.tileId === 0
      ) {
        this.calculateTileCollision(nextProps);
      } else {
        this.props.actions.Tile.selectTile(0, 0);
      }
    } else if (react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId')) {
      // reset and recalculate collisions on room change
      this.roomComponent = collision.resetCollision(this.roomComponent);
      this.calculateTileCollision(nextProps);
    } else if (react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].lightRadius')) {
      // recalculate collisions on tile or radius change
      this.calculateTileCollision(nextProps);
    }
  }

  setPlayerOffset(nextProps) {
    if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].lightRadius') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
      this.calculatePlayerOffset(nextProps);
    }
  }

  /* render */

  render() {
    return (
      <div className="player">
        <PlayerView {...this.state.playerProps} />
        <LightRadiusView {...this.state.lightRadiusProps} />
      </div>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'Entity', 'Tile', 'GameBoard',
  ]),
  dispatch => redux.mapActions(dispatch, [
    'Entity', 'Player', 'Tile'
  ])
)(PlayerContainer);
