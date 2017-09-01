import {
  ENTITY_CONSTANTS,
} from '../../constants';
import { dom } from '../../helpers/helpers'

export default {

  entityOffset: (entity, reset) => {
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

  entityOffsetResize: entity => {
    return (dispatch, getState) => getOffset(dispatch, getState, entity);
  },

  entityOffsetRecalc: () => {
    return (dispatch, getState) => {
      return Object.keys(getState().Entity).forEach(name => {
        const entities = document.querySelectorAll('.' + name.toLowerCase());
        return entities.forEach(entity => {
          const id = Number(entity.id.replace(name.toLowerCase(), ''));
          entity.type = name;
          entity.props = { children: { props: { id } } };
          return getOffset(dispatch, getState, entity, true);
        });
      });
    };
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

const getStyle = (state, dispatch, entity = null) => {
  const entityState = state.Entity[entity.type];
  const entityId = entity.props.children.props.id;

  const entityPosition = entityState.spawns[entityId].position;
  const entityRelativeSize = entityState.relativeSize;
  const entityAlignment = entityState.alignment;
  const hasPerspective = state.GameBoard.hasPerspective;

  // entity
  const entityRect = {
    width:state.Tile.width * entityRelativeSize.width,
    height:state.Tile.height * entityRelativeSize.height
  };

  // board offset
  const tile = document.querySelector(`#tile${entityPosition}`);
  const offsetTop = tile.offsetTop;
  const offsetLeft = tile.offsetLeft;

  // inline offset
  let modifier;
  switch (entityAlignment) {
    case 'center-center':
    default:
      modifier = .5;
      break;
  }
  const inlineOffsetTop = state.Tile.height * modifier - (hasPerspective ? entityRect.height : entityRect.height * modifier);
  const inlineOffsetLeft = state.Tile.width * modifier - entityRect.width * modifier;

  return {
    top: `${Math.round(offsetTop + inlineOffsetTop)}px`,
    left: `${Math.round(offsetLeft + inlineOffsetLeft)}px`,
    width: `${Math.round(entityRect.width)}px`,
    height: `${Math.round(entityRect.height)}px`,
  };
};
