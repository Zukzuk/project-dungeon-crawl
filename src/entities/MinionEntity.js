import {
  TILE_CONSTANTS
} from '../constants';

export default {
  resize: (entity, childProps) => {
    addEventListener("optimizedResize", () => childProps.actions.entityOffsetResize(entity));
  },

  mount: (entity, childProps) => {
    return childProps.actions.entityOffsetAsync(entity);
  },

  update: (entity, childProps) => {
    // switch (childProps.state.lastAction) {
    //   case TILE_CONSTANTS.TILE_SELECT:
    //     return childProps.actions.entityOffset(entity);
    // }
  },

};
