import React from 'react';
import './RoomView.scss';

export default props => {
  const classList = 'room';
  const id = 'room' + props.id;
  const style = props.style;
  return <div className={ classList } id={ id } style={ style }>{ props.children }</div>;
};
