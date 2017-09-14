import { GAME_MENU_CONSTANTS } from '../../constants';
import initialState from '../initialStates/GameBoardState';

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_MENU_CONSTANTS.PERSPECTIVE_TOGGLE:
      return {
        ...state,
        hasPerspective: action.payload
      };

    case GAME_MENU_CONSTANTS.UPDATE_LEVEL:
      return {
        ...state,
        level: action.payload
      };

    default:
      return state
  }
};
