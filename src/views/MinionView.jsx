import React from 'react';
import './MinionView.scss';

const MinionView = props => {
  const classList = 'entity minion';
  const id = 'minion' + props.id;
  const style = props.state.Minion.spawns[props.id].style;
  return <div className={ classList } id={ id } style={ style }></div>;
};

export default MinionView;
