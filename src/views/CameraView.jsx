import React from 'react';
import './CameraView.scss';

export default props => {
  const id = 'camera';
  const style = (props.pan) ? { left: `${props.pan.x}px`, top: `${props.pan.y}px` } : null;
  return <div id={ id } style={ style }>{ props.children }</div>;
};
