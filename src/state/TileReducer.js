import {
  TILE_CONSTANTS
} from '../constants';
import initialState from './TileState';

export default (state = initialState, action) => {
  switch (action.type) {

    case TILE_CONSTANTS.SELECT:
      return {
        ...state,
        tileId: action.payload.tileId,
        roomId: action.payload.roomId
      };

    default:
      return state
  }
};
