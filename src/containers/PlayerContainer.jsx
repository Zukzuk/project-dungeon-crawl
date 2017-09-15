import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  componentConstruct = props => {
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
  };

  componentDidMount = () => {
    // place the players
    dom.afterNextRender(this.props.actions.Entity.offsetAllEntities, ['Player']);
  };

  /* updates */

  getPlayerProps(props) {
    return {
      state: props.state.Entity.Player,
      actions: props.actions.Entity.Player,
      id: 0
    };
  };

  getLightRadiusProps(props) {
    return {
      state: props.state.Entity.Player
    };
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    // update position
    if (nextProps.state.Entity.Player.spawns[0].position !== this.props.state.Entity.Player.spawns[0].position) {
      return true;
    }
    // update lightRadius
    if (nextProps.state.Entity.Player.spawns[0].lightRadius === this.props.state.Entity.Player.spawns[0].lightRadius) {
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
    'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, {
    Entity: EntityActions
  })
)(PlayerContainer);
