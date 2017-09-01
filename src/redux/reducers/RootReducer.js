import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Entity from './EntityReducer';
import GameBoard from './GameBoardReducer';
import GameMenu from './GameMenuReducer';
import Tile from './TileReducer';
import Event from './EventReducer';

export default combineReducers({
  routing: routerReducer,
  Event, GameMenu,
  GameBoard, Tile, Entity
})
