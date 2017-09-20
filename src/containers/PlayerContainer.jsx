import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import collision from '../helpers/collision';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  componentDidMount() {

    // const connectedPlayerProps = {
    //   state: props.state.Entity.Player,
    //   actions: props.actions.Entity.Player
    // };

    // this.connectedPlayers = spawns.reduce((result, spawn, index) => {
    //   if (index) {
    //     connectedPlayerProps.key = index;
    //     connectedPlayerProps.id = index;
    //     result.push(<PlayerView {...connectedPlayerProps} />);
    //   }
    //   return result;
    // }, []);
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
    dom.afterNextRender(() => {
      if (!collision.isValid(props.state.Tile.roomId)) collision.reset();
      collision.compute(
        `#room${props.state.Tile.roomId}`,
        '#light-radius',
        props.state.Tile.size,
        props.state.Tile.roomId,
        props.state.Entity.Player.spawns[0].position,
        props.state.Entity.Player.spawns[0].lightRadius
      );
    });
  }

  shouldComponentUpdate(nextProps) {

    /* create update shorthand for some props */

    const update = {
      next: {
        PlayerSpawn: nextProps.state.Entity.Player.spawns[0]
      },
      current: {
        PlayerSpawn: this.props.state.Entity.Player.spawns[0]
      }
    };

    /* reactive actions */

    // fire offset action on position change
    if (update.next.PlayerSpawn.position !== update.current.PlayerSpawn.position) {
      dom.afterNextRender(() => {
        this.props.actions.Entity.offsetSingleEntity('Player', 0);
      });
    }
    // fire offset action on INITIAL lightRadius change
    else if (update.next.PlayerSpawn.lightRadius === undefined) {
      this.props.actions.Entity.offsetSingleEntity('Player', 0);
    }
    // fire offset action on gameboard perspective change
    else if (nextProps.state.GameBoard.hasPerspective !== this.props.state.GameBoard.hasPerspective) {
      this.props.actions.Entity.offsetSingleEntity('Player', 0);
    }
    // fire position action on tile change
    else if (nextProps.state.Tile.tileId !== this.props.state.Tile.tileId) {
      this.props.actions.Player.updatePosition(nextProps.state.Tile.tileId);
    }

    /* reactive rendering and optional actions */


    // render offset action on gameboard level change
    if (nextProps.state.GameBoard.level !== this.props.state.GameBoard.level) {
      dom.resetCollision();
      dom.afterNextRender(() => {
        this.props.actions.Tile.selectTile(0, 0);
      });
      return true;
    }
    // render offset with collision detection
    else if (update.next.PlayerSpawn.styleId !== update.current.PlayerSpawn.styleId && update.next.PlayerSpawn.styleId !== undefined) {
      this.updateTileCollision(nextProps);
      return true;
    }
    // render lightRadius with collision detection
    else if (update.next.PlayerSpawn.lightRadius !== update.current.PlayerSpawn.lightRadius && update.current.PlayerSpawn.lightRadius !== undefined) {
      this.props.actions.Entity.offsetSingleEntity('Player', 0);
      this.updateTileCollision(nextProps);
      return true;
    }
    // render lightRadius offset
    else if (update.next.PlayerSpawn.lightRadiusStyleId !== update.current.PlayerSpawn.lightRadiusStyleId) {
      return true;
    }

    // do not render
    return false;
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
