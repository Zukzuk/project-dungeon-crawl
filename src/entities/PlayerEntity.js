import {
  PLAYER_CONSTANTS
} from '../constants';

export default {
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
