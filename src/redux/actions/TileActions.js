import {
  TILE_CONSTANTS
} from '../../constants';
import PlayerActions from './PlayerActions';

export default {

  selectTile: index => {
    return dispatch => {
      dispatch({
        type: TILE_CONSTANTS.SELECT,
        payload: index
      });
    }
  }
};
