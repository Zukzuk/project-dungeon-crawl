import React from 'react';
import './MinionView.scss';

const MinionView = props => {
  const id = 'minion' + props.id;
  const style = props.state.Minion.spawns[props.id].style;
  return <div className='entity minion' id={ id } style={ style }></div>;
};

export default MinionView;
