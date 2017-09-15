import {
  ENTITY_CONSTANTS, TILE_CONSTANTS
} from '../../constants';
import TileActions from './TileActions'
import { dom } from '../../helpers/helpers'
import ReactDOM from 'react-dom';
import PF from 'pathfinding';

export default {

  entityOffset: (entity, reset) => {
    return (dispatch, getState) => getOffset(dispatch, getState, entity, reset);
  },

  entityOffsetAsync: entity => {
    return (dispatch, getState) => {
      dispatch({
        type: ENTITY_CONSTANTS.ENTITY_OFFSET_PREPARE
      });

      return setTimeout(() => getOffset(dispatch, getState, entity), 0);
    }
  },

  entityOffsetResize: entity => {
    return (dispatch, getState) => getOffset(dispatch, getState, entity, true);
  },

  entityOffsetRecalc: () => {
    return (dispatch, getState) => {
      return Object.keys(getState().Entity).forEach(name => {
        if (name !== 'lastAction') {
          const entities = document.querySelectorAll('.' + name.toLowerCase());
          return entities.forEach(entity => {
            const id = Number(entity.id.replace(name.toLowerCase(), ''));
            entity.type = name;
            entity.props = { children: { props: { id } } };
            return getOffset(dispatch, getState, entity, true);
          });
        }
      });
    };
  },

  entityPlanRoute: (entity, index) => {
    return (dispatch, getState) => planRoute(dispatch, getState, entity);
  }

};

const getOffset = (dispatch, getState, entity, reset) => {
  const style = getStyle(getState(), dispatch, entity, reset);
  dispatch({
    type: ENTITY_CONSTANTS.ENTITY_OFFSET_SET,
    payload: style,
    name: entity.type,
    id: entity.props.children.props.id,
  });
};

const getSize = (dispatch, size, entity) => {
  dispatch({
    type: ENTITY_CONSTANTS.ENTITY_SIZE_SET,
    payload: size,
    name: entity.type
  });
};

const calculateRoute = (source, destination) => {
  const numArray = Array.apply(null, Array(20)).map( (v, i) => { return i; } );
  numArray.map
  let grid = [];
  for( let y = 0; y < 20; y++ ) {
    let row = [];
    for( let x = 0; x < 20; x++ )
      row.push(0);
    grid.push(row);
  }
  grid = new PF.Grid(grid);
  let finder = new PF.AStarFinder();
  return finder.findPath(source[0], source[1], destination[0], destination[1], grid);
}
const planRoute = (dispatch, getState, entity) => {
  //const route = [20, 40, 60, 61, 62, 63, 83, 103];
  const playerIndex = getState().Entity.Player.spawns[0].position;
  const playerXY = [playerIndex % 20, Math.floor(playerIndex/20)];
  const destinationIndex = getState().Tile.currentId;
  const destinationXY = [destinationIndex % 20, Math.floor(destinationIndex/20)];
  const routeXY = calculateRoute(playerXY, destinationXY);
  //console.log("PlayerXY:", playerXY);
  //console.log("destinationXY:", destinationXY);
  //console.log("routeXY:", routeXY);
  const route = routeXY.map( (xy) => {return xy[0] + xy[1] * 20} );
  console.log("route:", route);
  // snakeHightlightTiles is a development action, which shouldn't fire in production
  snakeHightlightTiles(dispatch, route);

  dispatch({
    type: ENTITY_CONSTANTS.ENTITY_FOLLOW_PATH,
    payload: route,
    name: entity.type,
    id: entity.props.children.props.id,
  });
};

const snakeHightlightTiles = (dispatch, route) => {
  for( let i=0; i < route.length; i++ ) {
    dispatch(TileActions.highlightTile(route[i], i));
  }
};

const getStyle = (state, dispatch, entity = null, reset = false) => {
  const entityState = state.Entity[entity.type];
  const entityId = entity.props.children.props.id;

  const entityPosition = entityState.spawns[entityId].position;
  const entityRelativeSize = entityState.relativeSize;
  const entityAlignment = entityState.alignment;
  const hasPerspective = state.GameBoard.hasPerspective;

  // tile
  let tileRect = state.Tile.size;
  if (!tileRect && !entity) {
    throw new Error('React component reference missing!');
  } else if(reset || !tileRect) {
    const tile = ReactDOM.findDOMNode(entity).parentNode;
    tileRect = dom.getComputedSize(tile.children[entityPosition]);
    dispatch(TileActions.tileSize(tileRect));
  }

  // entity
  let entityRect = entityState.size;
  if (reset || !entityRect) {
    entityRect = {
      width:tileRect.width * entityRelativeSize.width,
      height:tileRect.height * entityRelativeSize.height
    };
    getSize(dispatch, entityRect, entity);
  }

  // board offset
  const columns = state.GameBoard.columns;
  const row = Math.max(0, Math.floor(entityPosition / columns));
  const column = Math.max(0, entityPosition - (row * columns));
  const offsetTop = row * tileRect.height;
  const offsetLeft = column * tileRect.width;

  // inline offset
  let modifier;
  switch (entityAlignment) {
    case 'center-center':
    default:
      modifier = .5;
      break;
  }
  const inlineOffsetTop = tileRect.height * modifier - ((!hasPerspective) ? entityRect.height * modifier : entityRect.height);
  const inlineOffsetLeft = tileRect.width * modifier - entityRect.width * modifier;

  return {
    top: `${Math.round(offsetTop + inlineOffsetTop)}px`,
    left: `${Math.round(offsetLeft + inlineOffsetLeft)}px`,
    width: `${Math.round(entityRect.width)}px`,
    height: `${Math.round(entityRect.height)}px`,
  };
};
