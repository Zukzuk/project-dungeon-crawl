import React from 'react';
import './TileView.scss';

export default props => {
  const { id, x, y, style, onClick } = props;
  const classList = 'tile';
  const tileId = `tile${id}`;
  const coord = `${x}-${y}`;
  const tileNumber = id + 1;

  return (
    <div className={ classList } id={ tileId } style={ style } onClick={ onClick } data-coord={ coord } data-light='fogofwar'>
      { tileNumber }
    </div>
  );
};
