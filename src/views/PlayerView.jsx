import React from 'react';
import './PlayerView.scss';

export default props => {
  const classList = 'entity player';
  const id = 'player' + props.id;
  const style = props.state.spawns[props.id].style;
  const offsetStyle = style ? {
    top: style.top,
    left: style.left
  } : null;
  const iconStyle = style ? {
    width: style.width,
    height: style.height
  } : null;

  return (
    <div className={ classList } id={ id } style={ offsetStyle }>
      <div className='icon' style={ iconStyle }></div>
    </div>
  );
};
