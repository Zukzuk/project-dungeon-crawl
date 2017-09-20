import React from 'react';
import './LightRadiusView.scss';

export default props => {
  const id = 'light-radius';
  const { style } = props;
  return (
    <div id={ id } style={ style }></div>
  );
};
