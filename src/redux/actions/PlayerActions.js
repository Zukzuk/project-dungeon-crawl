import {
  PLAYER_CONSTANTS
} from '../../constants';
import EntityActions from './EntityActions';

export default {
  updatePosition: index => {
    return (dispatch, getState) => {
      const name = 'Player';
      const id = getState().Entity.Player.currentId;

      dispatch({
        type: PLAYER_CONSTANTS.POSITION_SET,
        name,
        id,
        payload: index
      });

      dispatch(EntityActions.offsetSingleEntity(name, id));
    }
  }
};
