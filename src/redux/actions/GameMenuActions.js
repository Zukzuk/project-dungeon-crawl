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

      dispatch(EntityActions.entityOffsetRecalc());
    }
  }
};
