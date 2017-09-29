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
    this.updatePan(nextProps, this.updatePan.name);
  }

  updatePan(nextProps, methods) {
    if (_react_.stateDidUpdate(this, methods, nextProps, 'Tile.tileId') ||
      _react_.stateDidUpdate(this, methods, nextProps, 'Tile.roomId')) {
      this.calculatePan(nextProps);
    }
  }

  /* methods */

  calculatePan(props) {
    const tileId = props.state.Tile.tileId;
    const roomId = props.state.Tile.roomId;
    const tileElm = document.querySelector(`#tile${tileId}`);
    const roomElm = document.querySelector(`#room${roomId}`);
    const gameboardElm = document.querySelector(`#gameboard`);
    if (tileElm && roomElm && gameboardElm) this.setCameraProps(tileElm, tileElm.getBoundingClientRect(), roomElm, gameboardElm.getBoundingClientRect());
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
    'Tile'
  ]),
)(CameraContainer);
