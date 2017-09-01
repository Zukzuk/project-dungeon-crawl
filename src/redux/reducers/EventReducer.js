import initialState from '../initialStates/EventState';

export default (state = initialState, action) => {
  return {
    ...state,
    lastEvent: action.type
  }
};
