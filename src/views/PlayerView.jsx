import React from 'react';
import './PlayerView.scss';

const PlayerView = props => {
  const classList = props.id ? 'entity player' : 'entity player user';
  const id = 'player' + props.id;
  const style = props.state.Player.spawns[props.id].style;
  return <div className={ classList } id={ id } style={ style }></div>;
};

export default PlayerView;
