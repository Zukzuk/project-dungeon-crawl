import React from 'react';
import './RoomView.scss';

export default props => {
  const classList = 'camera';
  const style = props.style;
  return <div className={ classList } style={ style }>{ props.children }</div>;
};
