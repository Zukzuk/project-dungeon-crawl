import { GAME_MENU_CONSTANTS } from '../../constants';

const initialState = {
  columns: 20,
  rows: 20,
  gutter: 1,
  hasPerspective: false
};

export default (state = initialState, action) => {
  switch (action.type) {
    case GAME_MENU_CONSTANTS.PERSPECTIVE_TOGGLE:
      return {
        ...state,
        hasPerspective: action.payload
      };

    default:
      return state
  }
};