import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { redux } from '../helpers/helpers';
import GameMenuView from '../views/GameMenuView';
import GameMenuActions from '../redux/actions/GameMenuActions';

class GameMenuContainer extends PureComponent {

  getMenuItems = props => {
    const { actions, state } = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    const incrLevel = () => actions.GameMenu.updateLevel(state.GameBoard.level + 1);
    const decrLevel = () => actions.GameMenu.updateLevel(Math.max(1, state.GameBoard.level - 1));
    return [
      <button key="TogglePersp" onClick={ togglePersp }>Turn perspective { state.GameMenu.perspectiveLabel }</button>,
      this.props.state.GameBoard.level,
      <button key="IncrLevel" onClick={ incrLevel }>Increment level { state.GameMenu.incrementLevelLabel }</button>,
      <button key="DecrLevel" onClick={ decrLevel }>Decrement level { state.GameMenu.decrementLevelLabel }</button>
    ]
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
