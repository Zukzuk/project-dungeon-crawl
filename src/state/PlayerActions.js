import {
  PLAYER_CONSTANTS
} from '../constants';

export default {
  updatePosition: () => {
    return (dispatch, getState) => {
      const state = getState();
      const name = 'Player';
      const id = state.Entity.Player.currentId;

      dispatch({
        type: PLAYER_CONSTANTS.POSITION_SET, name, id,
        payload: { tileId: state.Tile.tileId, roomId: state.Tile.roomId }
      });
    }
  },

  updateLightRadius: newRadius => {
    return (dispatch, getState) => {
      const state = getState();
      const name = 'Player';
      const id = state.Entity.Player.currentId;

      dispatch({
        type: PLAYER_CONSTANTS.LIGHT_RADIUS_SET, name, id,
        payload: newRadius
      });
    }
  }
};
