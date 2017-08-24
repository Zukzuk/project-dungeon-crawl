import {
  TILE_CONSTANTS
} from '../constants';

export default {
  mount: (entity, childProps) => {
    return childProps.actions.entityOffsetAsync(entity);
  },

  resize: (entity, childProps) => {
    addEventListener("optimizedResize", () => childProps.actions.entityOffsetResize(entity));
  },

  update: (entity, childProps) => {
    switch (childProps.state.lastAction) {
      case TILE_CONSTANTS.TILE_SELECT:
        return childProps.actions.entityOffset(entity);
    }
  },

};