import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import EntityContainer from '../containers/EntityContainer';
import PlayerView from '../views/PlayerView';

const getPlayer = (props, index) => (
  <EntityContainer key={index}>
    <PlayerView {...props} />
  </EntityContainer>
);

class PlayerContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    const playerProps = {
      state: props.state.Entity,
      actions: props.actions.Entity
    };
    const spawns = props.state.Entity.Player.spawns;

    this.players = spawns.reduce((result, spawn, index) => {
      playerProps.id = index;
      result.push(getPlayer(playerProps, index));
      return result;
    }, []);
  };

  componentDidMount = () => {
    this.props.actions.entityOffsetAsync(this);
  };

  /* updates */

  /* render */

  render = () => this.players;
}

export default connect(
  state => redux.mapState(state, [
    'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, {
    Entity: EntityActions
  })
)(PlayerContainer);
