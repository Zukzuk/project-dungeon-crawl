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

    case PLAYER_CONSTANTS.POSITION_SET:
      return dotProp.set(state, `${action.name}.spawns.${action.id}.position`, action.payload);

    case PLAYER_CONSTANTS.LIGHT_RADIUS_SET:
      const radius = Math.max(1, action.payload);
      return dotProp.set(state, `${action.name}.spawns.${action.id}.lightRadius`, radius);

    default:
      return state
  }
};
