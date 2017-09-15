import {
  GAME_MENU_CONSTANTS
} from '../../constants';
import EntityActions from './EntityActions'

export default {
  togglePerspective: flag => {
    return dispatch => {
      dispatch({
        type: GAME_MENU_CONSTANTS.PERSPECTIVE_TOGGLE,
        payload: flag
      });

      dispatch(EntityActions.offsetAllEntities());
    }
  },

  updateLevel: newLevel => {
    return dispatch => {
      dispatch({
        type: GAME_MENU_CONSTANTS.UPDATE_LEVEL,
        payload: newLevel
      });
    }
  },

  updateLightRadius: newRadius => {
    return dispatch => {
      dispatch({
        type: GAME_MENU_CONSTANTS.UPDATE_LIGHT_RADIUS,
        payload: newRadius
      });
    }
  }
};
