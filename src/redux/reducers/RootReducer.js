import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

import Entity from './EntityReducer';
import GameBoard from './GameBoardReducer';
import GameMenu from './GameMenuReducer';
import Tile from './TileReducer';

export default combineReducers({
  routing: routerReducer,
  Entity, GameBoard, GameMenu, Tile
})