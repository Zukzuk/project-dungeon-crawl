import React from 'react';
import './LightRadiusView.scss';

export default props => {
  if (props.style) {
    const id = 'light-radius';
    const {style} = props;

    return (
      <div id={id} style={style}></div>
    );
  } else {
    return null;
  }
};
