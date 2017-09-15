import React from 'react';
import './DungeonView.scss';

const DungeonView = props => {
  const classList = props.state.hasPerspective ? 'perspective' : '';
  return (
    <div id='dungeon' className={ classList }>{ props.children }</div>
  );
};

export default DungeonView;
