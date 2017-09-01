import {
  GAME_MENU_CONSTANTS
} from '../../constants';
import initialState from '../initialStates/GameMenuState';

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_MENU_CONSTANTS.PERSPECTIVE_TOGGLE:
      return {
        ...state,
        perspectiveLabel: action.payload ? 'off' : 'on'
      };

    default:
      return state
  }
};
