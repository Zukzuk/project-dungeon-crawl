import React from 'react';
import './RoomView.scss';

const CameraView = props => {
  const classList = 'camera';
  const style = props.style;
  return <div className={ classList }  style={ style }>{ props.children }</div>;
};

export default CameraView;
