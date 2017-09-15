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
  let newState;

  switch (action.type) {

    case PLAYER_CONSTANTS.POSITION_SET:
      return dotProp.set(state, `${action.name}.spawns.${action.id}.position`, action.payload);

    case ENTITY_CONSTANTS.OFFSET_SET:
      const styleId = `${action.payload.top}${action.payload.left}${action.payload.width}${action.payload.height}`;
      newState = dotProp.set(state, `${action.name}.spawns.${action.id}.styleId`, styleId);
      newState = dotProp.set(newState, `${action.name}.spawns.${action.id}.style`, action.payload);
      return newState;

    case ENTITY_CONSTANTS.OFFSET_RESET:
      newState = dotProp.set(state, `${action.name}.spawns.${action.id}.styleId`, action.payload);
      newState = dotProp.set(newState, `${action.name}.spawns.${action.id}.style`, action.payload);
      newState = dotProp.set(newState, `${action.name}.spawns.${action.id}.position`, action.payload);
      return newState;

    case PLAYER_CONSTANTS.LIGHT_RADIUS_SET:
      const radius = Math.max(1, action.payload);
      return dotProp.set(state, `${action.name}.spawns.${action.id}.lightRadius`, radius);

    case ENTITY_CONSTANTS.LIGHTRADIUS_OFFSET_SET:
      const lightRadiusStyleId = `${action.payload.top}${action.payload.left}${action.payload.width}${action.payload.height}${action.payload.borderRadius}`;
      newState = dotProp.set(state, `${action.name}.spawns.${action.id}.lightRadiusStyleId`, lightRadiusStyleId);
      newState = dotProp.set(newState, `${action.name}.spawns.${action.id}.lightRadiusStyle`, action.payload);
      return newState;

    default:
      return state
  }
};
