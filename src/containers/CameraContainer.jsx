import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {_react_, _redux_} from '../helpers/helpers';
import CameraView from '../views/CameraView';

class CameraContainer extends PureComponent {

  /* lifecycle */

  state = {
    cameraProps: null
  };

  componentWillReceiveProps(nextProps) {
    const _update_ = {props: this.props, contextName: this.constructor.name};
    this.updatePan({...nextProps, ...{ ..._update_, methodName: this.updatePan.name }});
  }

  updatePan(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'GameBoard.level', 'blue') ||
      _react_.stateDidUpdate(nextProps, 'Tile.tileId') ||
      _react_.stateDidUpdate(nextProps, 'Tile.roomId')) {
      if (this.props.state.GameBoard.level === undefined) {
        setTimeout(() => this.calculatePan(nextProps), 500);
      } else {
        this.calculatePan(nextProps);
      }
    }
  }

  /* methods */

  calculatePan(props) {
    const tileId = props.state.Tile.tileId;
    const roomId = props.state.Tile.roomId;

    let tileElm = document.querySelector(`#tile${tileId}`);
    const tileRect = tileElm ? tileElm.getBoundingClientRect() : { width: 0, height: 0 };
    if (!tileElm) tileElm = { offsetLeft: 0, offsetTop: 0 };

    const roomElm = document.querySelector(`#room${roomId}`) || { offsetLeft: 0, offsetTop: 0 };

    const gameboardElm = document.querySelector(`#gameboard`);
    const gameboardRect = gameboardElm.getBoundingClientRect();

    if (tileElm && roomElm && gameboardElm) this.setCameraProps(tileElm, tileRect, roomElm, gameboardRect);
  }

  /* local state */

  setCameraProps(tileElm, tileRect, roomElm, gameboardRect) {
    this.setState({
      ...this.state,
      cameraProps: {
        pan: {
          x: (gameboardRect.width / 2 - tileRect.width / 2) - tileElm.offsetLeft - roomElm.offsetLeft,
          y: (gameboardRect.height / 2 - tileRect.height / 2) - tileElm.offsetTop - roomElm.offsetTop
        }
      }
    });
  }

  /* render */

  render() {
    return (
      <CameraView {...this.state.cameraProps}>
        {this.props.children}
      </CameraView>
    );
  }
}

export default connect(
  state => _redux_.mapState(state, [
    'Tile', 'GameBoard'
  ]),
)(CameraContainer);
