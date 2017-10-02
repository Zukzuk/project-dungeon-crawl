import React from 'react';
import './RoomView.scss';

export default props => {
  const {id, currentId, style} = props;
  const classList = 'room';
  const elmId = `room${id}`;

  return <div className={ classList } id={ elmId } style={ style }>{ props.children }</div>;
};
