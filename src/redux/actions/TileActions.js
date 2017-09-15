import {
  TILE_CONSTANTS
} from '../../constants';
import PlayerActions from './PlayerActions';

export default {
  tilePosition: (gutter, columns) => {
    return dispatch => {
      dispatch({
        type: TILE_CONSTANTS.TILE_POSITION_SET,
        payload: {margin: `${gutter}px`, width: `calc(100% * (1/${columns}) - ${gutter * 2}px)`},
      });
    }
  },

  tileSize: size => {
    return dispatch => {
      dispatch({
        type: TILE_CONSTANTS.TILE_SIZE_SET,
        payload: size
      });
    }
  },

  selectTile: index => {
    return dispatch => {
      dispatch({
        type: TILE_CONSTANTS.TILE_SELECT,
        payload: index
      });

      dispatch(PlayerActions.moveToPosition(index));
    }
  },

  highlightTile: (index, seq) => {
    return (dispatch, getState) => {
      //console.log("index:", index, "seq:", seq);
      //console.log("getState", getState());
      if( ! getState().Tile.Tiles[index].highlight ) {
        setTimeout( () => {
          dispatch({
            type: TILE_CONSTANTS.TILE_HIGHLIGHT,
            index: index,
            highlight: "highlight",
          });
        }, 50 * seq);
        setTimeout( () => {
          dispatch({
            type: TILE_CONSTANTS.TILE_HIGHLIGHT,
            index: index,
            highlight: null,
          });
        }, 50 * seq + 2000);
      }
    }
  },

};
