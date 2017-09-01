import {
  TILE_CONSTANTS
} from '../../constants';
import initialState from '../initialStates/TileState';

export default (state = initialState, action) => {
  switch (action.type) {
    case TILE_CONSTANTS.TILE_POSITION_SET:
      return {
        ...state,
        style: action.payload
      };

    case TILE_CONSTANTS.TILE_SIZE_SET:
      return {
        ...state,
        size: action.payload
      };

    case TILE_CONSTANTS.TILE_SELECT:
      return {
        ...state,
        currentId: action.payload
      };

    default:
      return state
  }
};
