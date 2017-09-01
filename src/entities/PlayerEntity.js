import React from 'react';
import EntityContainer from '../containers/EntityContainer';
import PlayerView from '../views/PlayerView';
import {
  PLAYER_CONSTANTS
} from '../constants';

const getPlayer = (props, index) => (
  <EntityContainer key={index}>
    <PlayerView {...props} />
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
    const spawns = props.state.Entity.Player.spawns;

    return spawns.reduce((result, spawn, index) => {
      playerProps.id = index;
      result.push(getPlayer(playerProps, index));
      return result;
    }, []);
  },

  init: (entity, childProps) => {
    addEventListener("optimizedResize", () => childProps.actions.entityOffsetResize(entity));
  },

  mount: (entity, childProps) => {
    return childProps.actions.entityOffsetAsync(entity);
  },

  update: (entity, childProps, event) => {
    switch (event.lastEvent) {
      case PLAYER_CONSTANTS.PLAYER_POSITION_SET:
        return childProps.actions.entityOffset(entity);
    }
  },

};
