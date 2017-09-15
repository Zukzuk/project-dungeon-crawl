import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import PlayerActions from '../redux/actions/PlayerActions';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  componentDidMount = () => {

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
    this.props.actions.Player.updatePosition(0);
    this.props.actions.Player.updateLightRadius(3);
  };

  /* updates */

  getPlayerProps = props => {
    return {
      state: props.state.Entity.Player,
      id: 0
    };
  };

  getLightRadiusProps = props => {
    return {
      state: props.state.Entity.Player
    };
  };

  updateTileCollision = (tileSize, playerPosition) => {
    dom.afterNextRender(dom.computeCollision, [
      dom.getComponent(document.querySelector('#room0')),
      dom.getComponent(document.querySelector('#light-radius')),
      tileSize,
      playerPosition
    ]);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    // reactive action
    if (nextProps.state.Entity.Player.spawns[0].position !== this.props.state.Entity.Player.spawns[0].position) {
      dom.afterNextRender(this.props.actions.Entity.offsetSingleEntity, ['Player', 0]);
    } else if (nextProps.state.Tile.currentId !== this.props.state.Tile.currentId) {
      this.props.actions.Player.updatePosition(nextProps.state.Tile.currentId);
    } else if (nextProps.state.Entity.Player.spawns[0].lightRadius !== this.props.state.Entity.Player.spawns[0].lightRadius) {
      this.props.actions.Entity.offsetSingleEntity('Player', 0);
    } else if (nextProps.state.GameBoard.hasPerspective !== this.props.state.GameBoard.hasPerspective) {
      this.props.actions.Entity.offsetSingleEntity('Player', 0);
    }

    // reactive render and optional internal updates
    if (nextProps.state.Entity.Player.spawns[0].styleId !== this.props.state.Entity.Player.spawns[0].styleId) {
      //this.updateTileCollision(nextProps.state.Tile.size, nextProps.state.Entity.Player.spawns[0].position);
      return true;
    } else if (nextProps.state.Entity.Player.spawns[0].lightRadiusStyleId !== this.props.state.Entity.Player.spawns[0].lightRadiusStyleId) {
      //this.updateTileCollision(nextProps.state.Tile.size, nextProps.state.Entity.Player.spawns[0].position);
      return true;
    }
    // do not render
    return false;
  };

  /* render */

  render = () => (
    <div className="player">
      <PlayerView { ...this.getPlayerProps(this.props) } />
      <LightRadiusView { ...this.getLightRadiusProps(this.props) } />
    </div>
  );
}

export default connect(
  state => redux.mapState(state, [
    'Entity',
    'Tile',
    'GameBoard',
  ]),
  dispatch => redux.mapActions(dispatch, {
    Entity: EntityActions,
    Player: PlayerActions
  })
)(PlayerContainer);
