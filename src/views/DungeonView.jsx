import React from 'react';
import './DungeonView.scss';

const DungeonView = props => {
  return <div className='dungeon'>{ props.children }</div>;
};

export default DungeonView;
