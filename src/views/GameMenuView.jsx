import React from 'react';
import './GameMenuView.scss';

const GameMenuView = props => {
  return <div className='game-menu'>{ props.children }</div>;
};

export default GameMenuView;