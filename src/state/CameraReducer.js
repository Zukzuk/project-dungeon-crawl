import {
  CAMERA_CONSTANTS
} from '../constants';
import initialState from './CameraState';

export default (state = initialState, action) => {
  switch (action.type) {

    case CAMERA_CONSTANTS.PAN:
      return {
        ...state,
        pan: action.payload
      };


    case CAMERA_CONSTANTS.ZOOM:
      return {
        ...state,
        zoom: action.payload
      };

    default:
      return state
  }
};
