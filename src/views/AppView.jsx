import React from 'react';
import './AppView.scss';

export default props => {
  const classList = 'app';
  return <div className={ classList }>{ props.children }</div>;
};
