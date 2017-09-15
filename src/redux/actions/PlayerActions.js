import {
  PLAYER_CONSTANTS
} from '../../constants';

export default {
  updatePosition: newPos => {
    return (dispatch, getState) => {
      const name = 'Player';
      const id = getState().Entity.Player.currentId;

      dispatch({
        type: PLAYER_CONSTANTS.POSITION_SET, name, id,
        payload: newPos
      });
    }
  },

  updateLightRadius: newRadius => {
    return (dispatch, getState) => {
      const name = 'Player';
      const id = getState().Entity.Player.currentId;

      dispatch({
        type: PLAYER_CONSTANTS.LIGHT_RADIUS_SET, name, id,
        payload: newRadius
      });
    }
  }
};
