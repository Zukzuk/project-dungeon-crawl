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
      actions: props.actions.Entity.Player
    };
    this.players = spawns.reduce((result, spawn, index) => {
      playerProps.key = index;
      playerProps.id = index;
      result.push(<PlayerView {...playerProps} />);
      return result;
    }, []);

    const lightRadiusProps = {
      state: props.state.Entity.Player
    };
    this.lightRadius = <LightRadiusView {...lightRadiusProps} />
  };

  componentDidMount = () => {
    // place the player
    dom.afterNextRender(this.props.actions.Entity.offsetAllEntities, ['Player']);
  };

  /* updates */

  componentWillReceiveProps = nextProps => {
  };

  /* render */

  render = () => (
    <div className="players">
      { this.players }
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
