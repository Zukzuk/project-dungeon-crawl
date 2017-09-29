import {
  GAME_MENU_CONSTANTS
} from '../constants';
import GameMenuActions from './GameMenuActions';

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
  },

  reloadLevel: () => {
    return (dispatch, getState) => {
      const currentLevel = getState().GameBoard.level;
      dispatch({
        type: GAME_MENU_CONSTANTS.LEVEL_SET,
        payload: undefined
      });
      return setTimeout(() => dispatch(GameMenuActions.updateLevel(currentLevel)), 100);
    }
  }
};
