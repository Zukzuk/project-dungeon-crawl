import React from 'react';
import './DungeonView.scss';

export default props => {
  const classList = props.state.hasPerspective ? 'perspective' : '';
  return (
    <div id='dungeon' className={ classList }>{ props.children }</div>
  );
};
