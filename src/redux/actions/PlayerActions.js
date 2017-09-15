import {
  PLAYER_CONSTANTS
} from '../../constants';

export default {
  updatePosition: index => {
    return (dispatch, getState) => {
      dispatch({
        type: PLAYER_CONSTANTS.PLAYER_POSITION_SET,
        name: 'Player',
        id: getState().Entity.Player.currentId,
        payload: index
      });
    }
  },

  moveToPosition: index => {
    return (dispatch, getState) => {
      dispatch({
        type: PLAYER_CONSTANTS.PLAYER_MOVE_TO_POSITION,
        name: 'Player',
        id: getState().Entity.Player.currentId,
        payload: index
      })
    }
  }
};
