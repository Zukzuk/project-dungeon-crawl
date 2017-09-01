import React from 'react';
import './TileView.scss';

const TileView = props => {
  return <div className='tile' onClick={ props.onClick }></div>;
};

export default TileView;
