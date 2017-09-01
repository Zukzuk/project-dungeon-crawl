import React from 'react';

export default {
  init: (entity, childProps) => {
    const { actions, state } = childProps;
    debugger;
    actions.tilePosition(state.gutter, state.columns);
  }
};
