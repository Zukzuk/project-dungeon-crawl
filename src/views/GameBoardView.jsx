import React from 'react';
import './GameBoardView.scss';

const GameBoardView = props => (
  <div className='game-board'>{ props.children }</div>
);

export default GameBoardView;