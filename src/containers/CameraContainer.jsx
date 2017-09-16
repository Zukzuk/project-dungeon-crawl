import React, { PureComponent } from 'react';
import {connect} from 'react-redux';
import {redux} from '../helpers/helpers';
import CameraView from '../views/CameraView';

class CameraContainer extends PureComponent {

  render() {
    return (
      <CameraView>
        { this.props.children }
      </CameraView>
    );
  }
}

export default connect(
  state => redux.mapState(state, [
    'Camera'
  ])
)(CameraContainer);
