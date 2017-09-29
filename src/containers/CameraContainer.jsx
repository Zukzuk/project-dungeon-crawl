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
      react.stateDidUpdate(this.props, nextProps, 'Tile.roomId')
    ) {
      debugger;
      this.calculatePan(nextProps);
    }
  }

  /* methods */

  calculatePan(props) {
    const tileId = props.state.Tile.tileId;
    const tileElm = document.querySelector(`#tile${tileId}`);
    debugger;
  }

  /* local state */

  setCameraProps(props) {
    this.setState({ ...this.state,
      cameraProps: {

      }
    });
  }

  /* render */

  render() {
    return (
      <CameraView { ...this.state.cameraProps }>
        { this.props.children }
      </CameraView>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'Tile',
  ]),
)(CameraContainer);
