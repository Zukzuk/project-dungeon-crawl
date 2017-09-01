import {
  ENTITY_CONSTANTS,
  PLAYER_CONSTANTS
} from '../../constants';
import { redux } from '../../helpers/helpers';
import PlayerStates from '../initialStates/PlayerState';
import MinionStates from '../initialStates/MinionState';

const initialState = {
  Player: PlayerStates,
  Minion: MinionStates
};

export default (state = initialState, action) => {

  switch (action.type) {

    case ENTITY_CONSTANTS.ENTITY_SIZE_SET:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          size: action.payload
        }
      };

    case ENTITY_CONSTANTS.ENTITY_OFFSET_SET:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          spawns: redux.updateArray(state[action.name].spawns, action, 'style')
        }
      };

    case PLAYER_CONSTANTS.PLAYER_POSITION_SET:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          spawns: redux.updateArray(state[action.name].spawns, action, 'position')
        }
      };

    default:
      return state
  }
};
