import {
  ENTITY_CONSTANTS, TILE_CONSTANTS
} from '../../constants';
import TileActions from './TileActions'
import PlayerActions from './PlayerActions'
import { dom } from '../../helpers/helpers'
import ReactDOM from 'react-dom';
import PathFinding from '../../helpers/PathFindingHelper'

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

  entityPlanRoute: (entity) => {
    return (dispatch, getState) => {
      const state = getState();
      const playerIndex = getState().Entity.Player.spawns[0].position
      const index = getState().Tile.currentId;
      const route = PathFinding.getRouteFromState(playerIndex, index, getState());
      snakeHightlightTiles(dispatch, route);
      dispatch({
        type: ENTITY_CONSTANTS.ENTITY_FOLLOW_PATH,
        payload: route,
        name: entity.type,
        id: entity.props.children.props.id,
      });
    }
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
