import React from 'react';
import './LightRadiusView.scss';

const LightRadiusView = props => {
  const classList = 'light-radius';
  const { lightRadiusStyle } = props.state.spawns[0];
  return (
    <div className={ classList } style={ lightRadiusStyle }></div>
  );
};

export default LightRadiusView;
