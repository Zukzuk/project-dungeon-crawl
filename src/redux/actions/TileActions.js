import {
  TILE_CONSTANTS
} from '../../constants';
import PlayerActions from './PlayerActions';

export default {

  selectTile: (tileId, roomId) => {
    return dispatch => {
      dispatch({
        type: TILE_CONSTANTS.SELECT,
        payload: {
          tileId, roomId
        }
      });
    }
  }
};
