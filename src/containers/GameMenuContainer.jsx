import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {_redux_} from '../helpers/helpers';
import GameMenuView from '../views/GameMenuView';

class GameMenuContainer extends PureComponent {

  getButtons(props) {
    const {actions, state} = props;
    const togglePersp = () => actions.GameMenu.togglePerspective(!state.GameBoard.hasPerspective);
    const reloadLevel = () => actions.GameMenu.reloadLevel();
    const incrLevel = () => actions.GameMenu.updateLevel(Math.min(12, state.GameBoard.level + 1));
    const decrLevel = () => actions.GameMenu.updateLevel(Math.max(1, state.GameBoard.level - 1));
    const incrLightRadius = () => actions.Player.updateLightRadius(state.Entity.Player.spawns[0].lightRadius + 1);
    const decrLightRadius = () => actions.Player.updateLightRadius(state.Entity.Player.spawns[0].lightRadius - 1);

    return [{
      title: `perspective: ${state.GameMenu.perspectiveLabel}`,
      buttons: [
        <button key="TogglePersp" onClick={togglePersp} className="btn btn-info">toggle</button>
      ]
    },{
      title: `level: ${state.GameBoard.level}`,
      buttons: [
        <button key="ReloadLevel" onClick={reloadLevel} className="btn btn-info">reload</button>,
        <button key="DecrLevel" disabled={state.GameBoard.level === 1} onClick={decrLevel} className="btn btn-info">-</button>,
        <button key="IncrLevel" disabled={state.GameBoard.level === 12} onClick={incrLevel} className="btn btn-info">+</button>
      ]
    },{
      title: `lightradius: ${state.Entity.Player.spawns[0].lightRadius}`,
      buttons: [
        <button key="DecrLightRadius" onClick={decrLightRadius} className="btn btn-info">-</button>,
        <button key="IncrLightRadius" onClick={incrLightRadius} className="btn btn-info">+</button>
      ]
    }]
  }

  getInfo(props) {
    const { state } = props;

    return [{
      title: `position: ${state.Entity.Player.spawns[0].position.tileId + 1}`
    }, {
      title: `room: ${state.Entity.Player.spawns[0].position.roomId}`
    }, {
      title: `tiles: ${Math.pow(2, state.GameBoard.level)}`
    }]
  }

  render() {
    return (
      <GameMenuView>
        {this.getButtons(this.props)}
        {this.getInfo(this.props)}
      </GameMenuView>
    );
  }
}

export default connect(
  state => _redux_.mapState(state, [
    'GameBoard', 'GameMenu', 'Entity'
  ]),
  dispatch => _redux_.mapActions(dispatch, [
    'GameMenu', 'Player'
  ])
)(GameMenuContainer);
