const initialState = {
  lastEvent: undefined
};

export default (state = initialState, action) => {
  return {
    ...state,
    lastEvent: action.type
  }
};
