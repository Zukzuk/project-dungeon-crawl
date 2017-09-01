import React from 'react';
import './TileView.scss';

const TileView = props => {
  const classList = 'tile';
  const id = 'tile' + props.id;
  const style = props.style;
  const onClick = props.onClick;
  return <div className={ classList } id={ id } style={ style } onClick={ onClick }></div>;
};

export default TileView;
