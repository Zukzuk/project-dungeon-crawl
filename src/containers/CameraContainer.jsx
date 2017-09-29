import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import {react, redux} from '../helpers/helpers';
import CameraView from '../views/CameraView';

class CameraContainer extends PureComponent {

  /* lifecycle */

  constructor(props) {
    super(props);
    this.state = {
      cameraProps: null
    }
  }

  componentWillReceiveProps(nextProps) {
    this.updatePan(nextProps);
  }

  updatePan(nextProps) {
    if (
      react.stateDidUpdate(this.props, nextProps, 'Tile.tileId') ||
      react.stateDidUpdate(this.props, nextProps, 'Tile.roomId') ||
      react.stateDidUpdate(this.props, nextProps, 'GameBoard.level')
    ) {
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
          x: (gameboardRect.width/2 - tileRect.width/2) - tileElm.offsetLeft - roomElm.offsetLeft,
          y: (gameboardRect.height/2 - tileRect.height/2) - tileElm.offsetTop - roomElm.offsetTop
        }
      }
    });
  }

  /* render */

  render() {
    return (
      <CameraView {...this.state.cameraProps}>
        { this.props.children }
      </CameraView>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'Tile', 'GameBoard'
  ]),
)(CameraContainer);
