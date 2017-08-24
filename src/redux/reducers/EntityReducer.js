import {
  ENTITY_CONSTANTS,
  TILE_CONSTANTS
} from '../../constants';
import { redux } from '../../helpers/helpers';
import PlayerStates from '../states/PlayerStates';
import MinionStates from '../states/MinionStates';

const initialState = {
  Player: PlayerStates,
  Minion: MinionStates,
  lastAction: undefined
};

export default (state = initialState, action) => {

  switch (action.type) {
    case ENTITY_CONSTANTS.ENTITY_OFFSET_SET:
      return {
        ...state,
        lastAction: undefined,
        [action.name]: {
          ...state[action.name],
          spawns: redux.updateArray(state[action.name].spawns, action, 'style')
        }
      };

    case ENTITY_CONSTANTS.ENTITY_SIZE_SET:
      return {
        ...state,
        lastAction: undefined,
        [action.name]: {
          ...state[action.name],
          size: action.payload
        }
      };

    case TILE_CONSTANTS.TILE_SELECT:
      return {
        ...state,
        lastAction: TILE_CONSTANTS.TILE_SELECT,
        [action.name]: {
          ...state[action.name],
          spawns: redux.updateArray(state[action.name].spawns, action, 'position')
        }
      };

    default:
      return state
  }
};