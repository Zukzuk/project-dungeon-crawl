import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {redux} from '../helpers/helpers';
import GameMenuView from '../views/GameMenuView';
import GameMenuActions from '../redux/actions/GameMenuActions';

class GameMenuContainer extends PureComponent {

  getMenuItems = props => {
    const {actions, state} = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    const incrLevel = () => actions.GameMenu.updateLevel(state.GameBoard.level + 1);
    const decrLevel = () => actions.GameMenu.updateLevel(Math.max(1, state.GameBoard.level - 1));
    return [{
      title: `perspective: ${state.GameMenu.perspectiveLabel}`,
      buttons: [
        <button key="TogglePersp" onClick={togglePersp}>Toggle</button>
      ]
    },{
      title: `level: ${this.props.state.GameBoard.level}`,
      buttons: [
        <button key="DecrLevel" onClick={decrLevel}>{ state.GameMenu.decrementLevelLabel }</button>,
        <button key="IncrLevel" onClick={incrLevel}>{ state.GameMenu.incrementLevelLabel }</button>
      ]
    }, {
      title: `number of tiles: ${Math.pow(2, this.props.state.GameBoard.level)}`
    }]
  };

  render = () => (
    <GameMenuView>
      { this.getMenuItems(this.props) }
    </GameMenuView>
  );
}

export default connect(
  state => redux.mapState(
    state, ['GameBoard', 'GameMenu']
  ),
  dispatch => redux.mapActions(
    dispatch, {GameMenu: GameMenuActions}
  )
)(GameMenuContainer);
