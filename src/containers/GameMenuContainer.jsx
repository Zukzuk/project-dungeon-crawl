import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {redux} from '../helpers/helpers';
import GameMenuView from '../views/GameMenuView';

class GameMenuContainer extends PureComponent {

  getMenuItems(props) {
    const {actions, state} = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    const reloadLevel = () => actions.GameMenu.updateLevel(state.GameBoard.level);
    const incrLevel = () => actions.GameMenu.updateLevel(Math.min(12, state.GameBoard.level + 1));
    const decrLevel = () => actions.GameMenu.updateLevel(Math.max(1, state.GameBoard.level - 1));
    const incrLightRadius = () => actions.Player.updateLightRadius(state.Entity.Player.spawns[0].lightRadius + 1);
    const decrLightRadius = () => actions.Player.updateLightRadius(state.Entity.Player.spawns[0].lightRadius - 1);

    return [{
      title: `perspective: ${state.GameMenu.perspectiveLabel}`,
      buttons: [
        <button key="TogglePersp" onClick={togglePersp}>toggle</button>
      ]
    },{
      title: `level: ${state.GameBoard.level}`,
      buttons: [
        <button key="ReloadLevel" onClick={reloadLevel}>reload</button>,
        <button key="DecrLevel" disabled={state.GameBoard.level === 1} onClick={decrLevel}>-</button>,
        <button key="IncrLevel" disabled={state.GameBoard.level === 12} onClick={incrLevel}>+</button>
      ]
    }, {
      title: `number of tiles: ${Math.pow(2, this.props.state.GameBoard.level)}`
    },{
      title: `lightradius: ${state.Entity.Player.spawns[0].lightRadius}`,
      buttons: [
        <button key="DecrLightRadius" onClick={decrLightRadius}>-</button>,
        <button key="IncrLightRadius" onClick={incrLightRadius}>+</button>
      ]
    }]
  }

  render() {
    return (
      <GameMenuView>
        {this.getMenuItems(this.props)}
      </GameMenuView>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'GameBoard', 'GameMenu', 'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, [
    'GameMenu', 'Player'
  ])
)(GameMenuContainer);
