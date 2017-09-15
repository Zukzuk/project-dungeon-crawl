import React from 'react';
import './TileView.scss';

const TileView = props => {
  //console.log(index);
  const state = props.state;
  const tileProps = state.Tiles[props.index] || {highlight: false};
  let cssClass = state.cssClass
  if( tileProps.highlight )
    cssClass += " " + (tileProps.highlightClass || 'highlight');

  return <div className={ cssClass } style={ state.style } onClick={ props.onClick }></div>;
};

export default TileView;
