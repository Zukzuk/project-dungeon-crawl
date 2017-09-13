import React from 'react';
import './DungeonView.scss';

const DungeonView = props => {
  return (
    <div id='dungeon'>{ props.children }</div>
  );
};

export default DungeonView;
