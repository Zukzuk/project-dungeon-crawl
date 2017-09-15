import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import MinionView from '../views/MinionView';

class MinionContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
  }

  /* updates */

  getMinions = props => {
    const minionProps = {
      state: props.state.Entity.Minion
    };

    props.state.Entity.Minion.spawns.reduce((result, spawn, index) => {
      minionProps.key = index;
      minionProps.id = index;
      result.push(<MinionView {...minionProps} />);
      return result;
    }, []);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    // always render
    return true;
  };

  /* render */

  render = () => <div className="minions">{ this.getMinions(this.props) }</div>;
}

export default connect(
  state => redux.mapState(state, [
    'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, {
    Entity: EntityActions
  })
)(MinionContainer);
