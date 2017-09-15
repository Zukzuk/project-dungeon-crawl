import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {redux} from '../helpers/helpers';
import GameMenuView from '../views/GameMenuView';
import GameMenuActions from '../redux/actions/GameMenuActions';

class GameMenuContainer extends PureComponent {

  getMenuItems = props => {
    const {actions, state} = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    const reloadLevel = () => actions.GameMenu.updateLevel(state.GameBoard.level);
    const incrLevel = () => actions.GameMenu.updateLevel(state.GameBoard.level + 1);
    const decrLevel = () => actions.GameMenu.updateLevel(Math.max(1, state.GameBoard.level - 1));
    const incrLightRadius = () => actions.GameMenu.updateLightRadius(state.Entity.Player.spawns[0].lightRadius + 1);
    const decrLightRadius = () => actions.GameMenu.updateLightRadius(Math.max(2, state.Entity.Player.spawns[0].lightRadius - 1));

    return [{
      title: `perspective: ${state.GameMenu.perspectiveLabel}`,
      buttons: [
        <button key="TogglePersp" onClick={togglePersp}>Toggle</button>
      ]
    },{
      title: `level: ${state.GameBoard.level}`,
      buttons: [
        <button key="ReloadLevel" onClick={reloadLevel}>{ state.GameMenu.reloadLabel }</button>,
        <button key="DecrLevel" onClick={decrLevel}>{ state.GameMenu.decrementLabel }</button>,
        <button key="IncrLevel" onClick={incrLevel}>{ state.GameMenu.incrementLabel }</button>
      ]
    }, {
      title: `number of tiles: ${Math.pow(2, this.props.state.GameBoard.level)}`
    },{
      title: `lightradius: ${state.Entity.Player.spawns[0].lightRadius}`,
      buttons: [
        <button key="DecrLightRadius" onClick={decrLightRadius}>{ state.GameMenu.decrementLabel }</button>,
        <button key="IncrLightRadius" onClick={incrLightRadius}>{ state.GameMenu.incrementLabel }</button>
      ]
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
    state, ['GameBoard', 'GameMenu', 'Entity']
  ),
  dispatch => redux.mapActions(
    dispatch, {GameMenu: GameMenuActions}
  )
)(GameMenuContainer);
