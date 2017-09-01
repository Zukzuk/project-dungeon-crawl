import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { redux } from '../helpers/helpers';
import GameMenuView from '../views/GameMenuView';
import GameMenuActions from '../redux/actions/GameMenuActions';

class GameMenuContainer extends PureComponent {

  getMenuItems = props => {
    const { actions, state } = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    return [
      <button key="TogglePersp" onClick={ togglePersp }>Turn perspective { state.GameMenu.perspectiveLabel }</button>
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
