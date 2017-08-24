import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import GameBoardContainer from './GameBoardContainer';
import Game from '../views/GameView';
import GameMenu from '../views/GameMenuView';
import GameMenuActions from '../redux/actions/GameMenuActions';

import { redux } from '../helpers/helpers';

class GameContainer extends PureComponent {

  /* lifecycle */

  /* game menu */

  getGameMenuChildren = props => {
    const { actions, state } = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    return [
      <button key="TogglePersp" onClick={ togglePersp }>Turn perspective { state.GameMenu.perspectiveLabel }</button>
    ]
  };

  /* render */

  render = () => (
    <Game>
      <GameMenu>{ this.getGameMenuChildren(this.props) }</GameMenu>
      <GameBoardContainer />
    </Game>
  );
}

export default connect(
  state => redux.mapState(
    state, ['GameBoard', 'GameMenu']
  ),
  dispatch => redux.mapActions(
    dispatch, {GameMenu: GameMenuActions}
  )
)(GameContainer);