import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';

import GameMenu from './state/GameMenuReducer';
import GameBoard from './state/GameBoardReducer';
import Entity from './state/EntityReducer';
import Tile from './state/TileReducer';
import Camera from './state/CameraReducer';

export const history = createHistory();

const initialState = {};
const enhancers = [];
const middleware = [
  thunk,
  routerMiddleware(history)
];

// if (process.env.NODE_ENV === 'development') {
  const devToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION__;

  if (typeof devToolsExtension === 'function') {
    enhancers.push(devToolsExtension());
  }
// }

const composedEnhancers = compose(
  applyMiddleware(...middleware),
  ...enhancers
);

const rootReducer = combineReducers({
  routing: routerReducer,
  GameMenu, GameBoard, Camera, Tile, Entity
});

const store = createStore(
  rootReducer,
  initialState,
  composedEnhancers
);

export default store;
