import React from 'react';
import './TileView.scss';

export default props => {
  const classList = 'tile';
  const id = 'tile' + props.id;
  const tileNumber = props.id + 1;
  const { style, onClick } = props;

  return (
    <div className={ classList } id={ id } style={ style } onClick={ onClick }>
      { tileNumber }
    </div>
  );
};
