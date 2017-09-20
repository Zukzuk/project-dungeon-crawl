import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {react, redux} from '../helpers/helpers';
import collision from '../helpers/collision';
import offset from '../helpers/offset';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.collisionBuffer = null;
    this.state = {
      playerProps: null,
      lightRadiusProps: null
    }
  }

  componentDidMount() {
    setTimeout(() => {
      this.props.actions.Tile.selectTile(0, 0);
      this.props.actions.Player.updateLightRadius(4);
    }, 1000);
  }

  /* updates */

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

  getCollisionBuffer(props) {
    this.collisionBuffer = collision.getBuffer(props.state.Entity.Player.spawns[0].position.roomId);
  }

  calculateTileCollision(props) {
    if (!this.collisionBuffer) this.getCollisionBuffer(props);

    if (this.collisionBuffer) {
      collision.tileCollision(
        this.collisionBuffer,
        props.state.Entity.Player.spawns[0].position.tileId,
        props.state.Entity.Player.spawns[0].lightRadius,
        props.state.Tile.size
      );
    }
  }

  calculatePlayerOffset(props) {
    if (!this.collisionBuffer) this.getCollisionBuffer(props);

    if (!isNaN(props.state.Entity.Player.spawns[0].position.tileId)) {
      const style = offset.playerOffset(this.collisionBuffer, props);
      const lightRadiusStyle = offset.lightRadiusOffset(this.collisionBuffer, props);
      this.getPlayerProps(style, lightRadiusStyle);
    }
  }

  componentWillReceiveProps(nextProps) {
    // set player position
    if (
      react.stateDidUpdate(this.props, nextProps, 'Tile.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Tile.roomId')
    ) {
      this.props.actions.Player.updatePosition();
    }

    // reset and recalculate collisions
    if (
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
      this.collisionBuffer = collision.resetCollision(this.collisionBuffer);
      if (
        nextProps.state.Entity.Player.spawns[0].position.tileId === 0
      ) {
        this.calculateTileCollision(nextProps);
      } else {
        this.props.actions.Tile.selectTile(0, 0);
      }
    } else if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId')
    ) {
      this.collisionBuffer = collision.resetCollision(this.collisionBuffer);
      this.calculateTileCollision(nextProps);
    } else if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].lightRadius')
    ) {
      this.calculateTileCollision(nextProps);
    }

    // update player style offset
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
