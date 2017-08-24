import React from 'react';
import './TileView.scss';

const TileView = props => {
  return <div className='tile' style={ props.state.style } onClick={ props.onClick }></div>;
};

export default TileView;
