import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {react, redux} from '../helpers/helpers';
import collision from '../helpers/collision';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.state = {
      playerProps: null,
      lightRadiusProps: null
    }
  }

  componentDidMount() {
    this.props.actions.Tile.selectTile(0, 0);
    this.props.actions.Player.updateLightRadius(4);
  }

  /* updates */

  getPlayerProps(props) {
    debugger;
    this.setState({ ...this.state,
      playerProps: {
        style: props.state.Entity.Player.spawns[0].style,
        id: 0
      }
    }, this.getLightRadiusProps);
  }

  getLightRadiusProps() {
    debugger;
    this.setState({ ...this.state,
      lightRadiusProps: {
        style: this.props.state.Entity.Player.spawns[0].lightRadiusStyle,
      }
    });
  }

  calculateTileCollision(props) {
    collision.tileCollision(
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
      collision.resetAndRecalculate(this.calculateTileCollision, nextProps);
    }

    // recalculate tile collision
    if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].lightRadius')
    ) {
      this.calculateTileCollision(nextProps);
    }

    // reset player style offset
    if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].position.roomId') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
      this.props.actions.Entity.offsetSingleEntity('Player', 0);
    }

    // render player offset
    if (
      react.stateDidUpdate(this.props, nextProps, 'Entity.Player.spawns[0].styleId')
    ) {
      this.getPlayerProps(nextProps);
    }
  }

  /* render */

  render() {
    return (
      <div className="player">
        <PlayerView { ...this.state.playerProps } />
        <LightRadiusView { ...this.state.lightRadiusProps } />
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
