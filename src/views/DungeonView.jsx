import React from 'react';
import './DungeonView.scss';

const DungeonView = props => {
  return (
    <div id='dungeon'>
      <div id='dungeon-inner'>
        { props.children }
      </div>
    </div>
  );
};

export default DungeonView;
