import React from 'react';

export default {
  init: (entity, childProps) => {
    const { actions, state } = childProps;
    actions.tilePosition(state.gutter, state.columns);
  }
};