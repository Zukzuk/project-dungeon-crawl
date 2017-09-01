import React from 'react';
import './RoomView.scss';

const RoomView = props => {
  return <div className='room'>{ props.children }</div>;
};

export default RoomView;
