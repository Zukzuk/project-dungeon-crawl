import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { react, dom, redux } from '../helpers/helpers';
import collision from '../helpers/collision';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  componentDidMount() {
    this.props.actions.Tile.selectTile(0, 0);
    this.props.actions.Player.updateLightRadius(4);
  }

  /* updates */

  getPlayerProps(props) {
    return {
      state: props.state.Entity.Player,
      id: 0
    };
  }

  getLightRadiusProps(props) {
    return {
      state: props.state.Entity.Player
    };
  }

  updateTileCollision(props) {
    collision.compute(
      `#room${props.state.Tile.roomId}`,
      '#light-radius',
      props.state.Tile.size,
      props.state.Tile.roomId,
      props.state.Entity.Player.spawns[0].position.tileId,
      props.state.Entity.Player.spawns[0].lightRadius
    );
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
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
      collision.resetAndRecalculate(this.updateTileCollision, nextProps);
    }

    // recalculate tile collision
    if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].lightRadius')
    ) {
      this.updateTileCollision(nextProps);
    }
  }

  /* render */

  render() {
    return (
      <div className="player">
        <PlayerView { ...this.getPlayerProps(this.props) } />
        <LightRadiusView { ...this.getLightRadiusProps(this.props) } />
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
