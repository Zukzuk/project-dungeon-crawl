import React from 'react';
import './LightRadiusView.scss';

const LightRadiusView = props => {
  const id = 'light-radius';
  const { lightRadiusStyle } = props.state.spawns[0];
  return (
    <div id={ id } style={ lightRadiusStyle }></div>
  );
};

export default LightRadiusView;
