import {
  ENTITY_CONSTANTS,
} from '../../constants';
import {dom} from '../../helpers/helpers'

export default {

  entityOffset: entity => {
    return (dispatch, getState) => getOffset(dispatch, getState, entity);
  },

  entityOffsetAsync: entity => {
    return (dispatch, getState) => {
      dispatch({
        type: ENTITY_CONSTANTS.ENTITY_OFFSET_PREPARE
      });
      return dom.afterNextRender(getOffset, [dispatch, getState, entity]);
    }
  },

  entityOffsetSingle: (type, id) => {
    return (dispatch, getState) => {
      const name = type.toLowerCase();
      let entity = document.querySelector('#' + name.toLowerCase() + id);
      entity.type = type;
      entity.props = {children: {props: {id: Number(entity.id.replace(name, ''))}}};
      getOffset(dispatch, getState, entity)
    }
  },

  entityOffsetAll: () => {
    return (dispatch, getState) => {
      // get all entities on game-board
      Object.keys(getState().Entity)
        .forEach(type => {
          const name = type.toLowerCase();
          document.querySelectorAll('.' + name)
            .forEach(entity => {
              entity.type = type;
              entity.props = {children: {props: {id: Number(entity.id.replace(name, ''))}}};
              getOffset(dispatch, getState, entity)
            });
        });
    }
  }
};

const getOffset = (dispatch, getState, entity) => {
  dispatch({
    type: ENTITY_CONSTANTS.ENTITY_OFFSET_SET,
    name: entity.type,
    id: entity.props.children.props.id,
    payload: getStyle(getState(), dispatch, entity)
  });
};

const getStyle = (state, dispatch, entity = null) => {
  const entityState = state.Entity[entity.type];
  const entityId = entity.props.children.props.id;

  const entityPosition = entityState.spawns[entityId].position;
  const entityRelativeSize = entityState.relativeSize;
  const entityAlignment = entityState.alignment;
  const hasPerspective = state.GameBoard.hasPerspective;

  // board offset
  const tile = document.querySelector(`#tile${entityPosition}`);
  const room = tile.parentElement;
  const offsetTop = tile.offsetTop + room.offsetTop;
  const offsetLeft = tile.offsetLeft + room.offsetLeft;

  // tile
  const tileRect = {
    width: state.Tile.width,
    height: state.Tile.height
  };

  // entity
  const entityRect = {
    width: tileRect.width * entityRelativeSize.width,
    height: tileRect.height * entityRelativeSize.height
  };

  // inline offset
  let modifier;
  switch (entityAlignment) {
    case 'center-center':
    default:
      modifier = {width: .5, height: .5};
      break;
  }
  const inlineOffsetTop = tileRect.height * modifier.height
    - (hasPerspective ? entityRect.height : entityRect.height * modifier.height);
  const inlineOffsetLeft = tileRect.width * modifier.width
    - entityRect.width * modifier.width;

  return {
    top: `${Math.round(offsetTop + inlineOffsetTop)}px`,
    left: `${Math.round(offsetLeft + inlineOffsetLeft)}px`,
    width: `${Math.round(entityRect.width)}px`,
    height: `${Math.round(entityRect.height)}px`,
  };
};
