import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import MinionView from '../views/MinionView';

class MinionContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    const minionProps = {
      state: props.state.Entity.Minion,
      actions: props.actions.Entity.Minion
    };
    const spawns = props.state.Entity.Minion.spawns;

    this.minions = spawns.reduce((result, spawn, index) => {
      minionProps.key = index;
      minionProps.id = index;
      result.push(<MinionView {...minionProps} />);
      return result;
    }, []);
  };

  componentDidMount = () => {
    dom.afterNextRender(this.props.actions.Entity.offsetAllEntities, ['Minion']);
  };

  /* updates */

  /* render */

  render = () => <div className="minions">{this.minions}</div>;
}

export default connect(
  state => redux.mapState(state, [
    'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, {
    Entity: EntityActions
  })
)(MinionContainer);
