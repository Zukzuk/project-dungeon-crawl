import React from 'react';
import './TileView.scss';

export default props => {
  const { id, row, column, style, onClick } = props;
  const classList = 'tile';
  const tileId = `tile${id}`;
  const coord = `${column}-${row}`;
  const tileNumber = id + 1;

  return (
    <div className={ classList } id={ tileId } style={ style } onClick={ onClick } data-coord={ coord } data-light='fogofwar'>
      { tileNumber }
    </div>
  );
};
