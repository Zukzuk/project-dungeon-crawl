import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import PlayerView from '../views/PlayerView';

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
      playerProps.key = index;
      playerProps.id = index;
      result.push(<PlayerView {...playerProps} />);
      return result;
    }, []);
  };

  componentDidMount = () => {
    dom.afterNextRender(this.props.actions.Entity.entityOffsetAll);
  };

  /* updates */

  /* render */

  render = () => <div className="players">{this.players}</div>;
}

export default connect(
  state => redux.mapState(state, [
    'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, {
    Entity: EntityActions
  })
)(PlayerContainer);
