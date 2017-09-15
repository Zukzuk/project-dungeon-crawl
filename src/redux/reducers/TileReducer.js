import {
  TILE_CONSTANTS
} from '../../constants';
import TileStates from '../states/TileStates';

const initialState = {
  ...TileStates
};

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

    case TILE_CONSTANTS.TILE_CLASS_SET:
      return {
        ...state,
        Tiles: [
          ...state.Tiles.slice(0, action.index),
          {cssClass: action.cssClass},
          ...state.Tiles.slice(action.index + 1, state.Tiles.length)
        ],
      };
    case TILE_CONSTANTS.TILE_HIGHLIGHT:
      return {
        ...state,
        Tiles: [
          ...state.Tiles.slice(0, action.index),
          {highlight: action.highlight},
          ...state.Tiles.slice(action.index + 1, state.Tiles.length)
        ]
      }
    default:
      return state
  }
};
