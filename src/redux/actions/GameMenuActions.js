import {
  GAME_MENU_CONSTANTS
} from '../../constants';

export default {
  togglePerspective: flag => {
    return dispatch => {
      dispatch({
        type: GAME_MENU_CONSTANTS.PERSPECTIVE_TOGGLE,
        payload: flag
      });
    }
  },

  updateLevel: newLevel => {
    return dispatch => {
      dispatch({
        type: GAME_MENU_CONSTANTS.LEVEL_SET,
        payload: newLevel
      });
    }
  }
};
