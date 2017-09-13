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

    case ENTITY_CONSTANTS.OFFSET_SET:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          spawns: redux.updateArray(state[action.name].spawns, action, 'style')
        }
      };

    case ENTITY_CONSTANTS.LIGHTRADIUS_OFFSET_SET:
      return {
        ...state,
        [action.name]: {
          ...state[action.name],
          spawns: redux.updateArray(state[action.name].spawns, action, 'lightRadiusStyle')
        }
      };

    case PLAYER_CONSTANTS.POSITION_SET:
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
