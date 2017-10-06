import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {_redux_} from '../helpers/helpers';
import MinionView from '../views/MinionView';

class MinionContainer extends PureComponent {

  /* lifecycle */

  /* updates */

  getMinions(props) {
    const minionProps = {
      state: props.state.Entity.Minion
    };

    props.state.Entity.Minion.spawns.reduce((result, spawn, index) => {
      minionProps.key = index;
      minionProps.id = index;
      result.push(<MinionView {...minionProps} />);
      return result;
    }, []);
  }

  shouldComponentUpdate(nextProps) {
    // always render
    return true;
  }

  /* render */

  render() {
    return (
      <div className="minions">
        {this.getMinions(this.props)}
      </div>
    );
  }
}

export default connect(
  state => _redux_.mapState(state, [
    'Entity'
  ]),
  dispatch => _redux_.mapActions(dispatch, [
    'Entity'
  ])
)(MinionContainer);
