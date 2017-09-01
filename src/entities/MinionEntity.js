import React from 'react';
import EntityContainer from '../containers/EntityContainer';
import MinionView from '../views/MinionView';

const getMinion = (props, index) => (
  <EntityContainer key={index}>
    <MinionView {...props} />
  </EntityContainer>
);

export default {
  create: props => {
    const playerProps = {
      state: {
        ...props.state.Entity,
        ...props.state.GameBoard
      },
      actions: props.actions.Entity
    };
    const spawns = props.state.Entity.Minion.spawns;

    return spawns.reduce((result, spawn, index) => {
      playerProps.id = index;
      result.push(getMinion(playerProps, index));
      return result;
    }, []);
  },

  resize: (entity, childProps) => {
    addEventListener("optimizedResize", () => childProps.actions.entityOffsetResize(entity));
  },

  mount: (entity, childProps) => {
    return childProps.actions.entityOffsetAsync(entity);
  }
};
