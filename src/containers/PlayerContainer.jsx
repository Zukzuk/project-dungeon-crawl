import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import PlayerView from '../views/PlayerView';
import LightRadiusView from '../views/LightRadiusView';

class PlayerContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    const spawns = props.state.Entity.Player.spawns;

    const playerProps = {
      state: props.state.Entity.Player,
      actions: props.actions.Entity.Player,
      id: 0
    };
    this.player = <PlayerView {...playerProps} />;

    const lightRadiusProps = {
      state: props.state.Entity.Player
    };
    this.lightRadius = <LightRadiusView {...lightRadiusProps} />;

    const connectedPlayerProps = {
      state: props.state.Entity.Player,
      actions: props.actions.Entity.Player
    };
    this.connectedPlayers = spawns.reduce((result, spawn, index) => {
      if (index) {
        connectedPlayerProps.key = index;
        connectedPlayerProps.id = index;
        result.push(<PlayerView {...connectedPlayerProps} />);
      }
      return result;
    }, []);
  };

  componentDidMount = () => {
    // place the players
    dom.afterNextRender(this.props.actions.Entity.offsetAllEntities, ['Player']);
  };

  /* updates */

  shouldComponentUpdate = (nextProps, nextState) => {
    debugger;
    return true;
  };

  /* render */

  render = () => (
    <div className="players">
      { this.connectedPlayers }
      { this.player }
      { this.lightRadius }
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
