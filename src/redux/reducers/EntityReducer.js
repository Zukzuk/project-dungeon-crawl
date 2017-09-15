import {
  ENTITY_CONSTANTS,
  PLAYER_CONSTANTS
} from '../../constants';
import PlayerStates from '../initialStates/PlayerState';
import MinionStates from '../initialStates/MinionState';

const initialState = {
  Player: PlayerStates,
  Minion: MinionStates
};

export default (state = initialState, action) => {

  switch (action.type) {

    case ENTITY_CONSTANTS.OFFSET_SET:
      return dotProp.set(state, `${action.name}.spawns.${action.id}.style`, action.payload);

    case ENTITY_CONSTANTS.LIGHTRADIUS_OFFSET_SET:
      return dotProp.set(state, `${action.name}.spawns.${action.id}.lightRadiusStyle`, action.payload);

    case PLAYER_CONSTANTS.POSITION_SET:
      return dotProp.set(state, `${action.name}.spawns.${action.id}.position`, action.payload);

    default:
      return state
  }
};
