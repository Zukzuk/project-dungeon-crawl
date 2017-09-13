import React from 'react';
import './TileView.scss';

const TileView = props => {
  const classList = 'tile';
  const id = 'tile' + props.id;
  const tileNumber = props.id + 1;
  const { style, onClick, column, row } = props;

  return (
    <div className={ classList } id={ id } style={ style }
         onClick={ onClick } data-column={ column } data-row={ row }>
      { tileNumber }
    </div>
  );
};

export default TileView;
