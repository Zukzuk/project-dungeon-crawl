import {
  TILE_CONSTANTS
} from '../../constants';
import PlayerActions from './PlayerActions';

export default {

  selectTile: index => {
    return dispatch => {
      dispatch({
        type: TILE_CONSTANTS.TILE_SELECT,
        payload: index
      });

      dispatch(PlayerActions.updatePosition(index));
    }
  }
};
