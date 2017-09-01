import {
  TILE_CONSTANTS
} from '../../constants';
import initialState from '../initialStates/TileState';

export default (state = initialState, action) => {
  switch (action.type) {

    case TILE_CONSTANTS.TILE_SELECT:
      return {
        ...state,
        currentId: action.payload
      };

    default:
      return state
  }
};
