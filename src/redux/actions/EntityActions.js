import {
  ENTITY_CONSTANTS,
} from '../../constants';

export default {

  entityOffsetSingle: (name, id) => {
    return (dispatch, getState) => {
      getOffset(dispatch, getState, name, id);
    }
  },

  entityOffsetAll: () => {
    return (dispatch, getState) => {
      // get all entities on game-board
      Object.keys(getState().Entity)
        .forEach(name => {
          document.querySelectorAll('.' + name.toLowerCase())
            .forEach(entity => {
              const id = Number(entity.id.replace(name.toLowerCase(), ''));
              getOffset(dispatch, getState, name, id)
            });
        });
    }
  }
};

const getOffset = (dispatch, getState, name, id) => {
  dispatch({
    type: ENTITY_CONSTANTS.ENTITY_OFFSET_SET,
    name,
    id,
    payload: getStyle(getState(), name, id)
  });
};

const getStyle = (state, name, id) => {
  const entityState = state.Entity[name];
  const entityId = id;

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
