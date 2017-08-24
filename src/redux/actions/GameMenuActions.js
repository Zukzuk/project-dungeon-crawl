import {
  GAME_MENU_CONSTANTS
} from '../../constants';
import PlayerActions from './EntityActions'

export default {
  togglePerspective: flag => {
    return dispatch => {
      dispatch({
        type: GAME_MENU_CONSTANTS.PERSPECTIVE_TOGGLE,
        payload: flag
      });

      dispatch(PlayerActions.entityOffsetRecalc());
    }
  }
};