import {
  ENTITY_CONSTANTS,
} from '../../constants';
import EntityActions from './EntityActions';
import { dom } from '../../helpers/helpers';

export default {

  offsetSingleEntity: (name, id) => {
    return (dispatch, getState) => {
      return EntityActions.entityOffset(dispatch, getState, name, id);
    }
  },

  offsetAllEntities: name => {
    return (dispatch, getState) => {
      // get all entities on game-board
      const target = name ? [name] : Object.keys(getState().Entity);
      target.forEach(name => {
        document.querySelectorAll('.' + name.toLowerCase())
          .forEach(entity => {
            const id = Number(entity.id.replace(name.toLowerCase(), ''));
            return EntityActions.entityOffset(dispatch, getState, name, id);
          });
      });
    }
  },

  entityOffset: (dispatch, getState, name, id) => {
    const styles = getStyle(getState(), name, id);
    dispatch({
      type: ENTITY_CONSTANTS.OFFSET_SET, name, id,
      payload: styles.entity
    });

    if (name === 'Player' && id === 0) {
      dispatch({
        type: ENTITY_CONSTANTS.LIGHTRADIUS_OFFSET_SET, name, id,
        payload: styles.lightRadius
      });
      dispatch(EntityActions.lightRadiusCollision());
    }
  },

  lightRadiusCollision: () => {
    return (dispatch, getState) => {
      const state = getState();
      dom.computeCollision(
        dom.getComponent(document.querySelector('#room0')),
        state.Tile.size,
        dom.getComponent(document.querySelector('#light-radius')),
        state.Entity.Player.spawns[0].position
      );
    }
  },

};

const getStyle = (state, name, id) => {
  const entityState = state.Entity[name];
  const entityId = id;

  const entityPosition = entityState.spawns[entityId].position;
  const entityLightRadius = entityState.spawns[entityId].lightRadius || 0;
  const entityRelativeSize = entityState.relativeSize;
  const entityAlignment = entityState.alignment;
  const hasPerspective = state.GameBoard.hasPerspective;

  // board offset
  const tile = document.querySelector(`#tile${entityPosition}`);
  if (!tile) return false;
  const room = tile.parentElement;
  const offsetTop = tile.offsetTop + room.offsetTop;
  const offsetLeft = tile.offsetLeft + room.offsetLeft;

  // tile
  const tileRect = {
    width: state.Tile.size,
    height: state.Tile.size
  };

  // entity
  const entityRect = {
    width: tileRect.width * entityRelativeSize.width,
    height: tileRect.height * entityRelativeSize.height
  };

  const entity = getEntityOffset(offsetTop, offsetLeft, tileRect, entityRect, entityAlignment, hasPerspective);
  const lightRadius = (name === 'Player' && id === 0)
    ? getLightRadiusOffset(offsetTop, offsetLeft, tileRect, entityLightRadius) : null;
  return {
    entity,
    lightRadius
  };
};

const getEntityOffset = (offsetTop, offsetLeft, tileRect, entityRect, entityAlignment, hasPerspective) => {
  // inline offset
  let modifier;
  switch (entityAlignment) {
    case 'center-center':
    default:
      modifier = {width: .5, height: .5};
      break;
  }

  const modifiedHeight = hasPerspective ? entityRect.height : entityRect.height * modifier.height;
  const modifiedWidth = entityRect.width * modifier.width;

  const inline = {
    offsetTop: tileRect.height * modifier.height - modifiedHeight,
    offsetLeft: tileRect.width * modifier.width - modifiedWidth
  };

  return {
    top: `${Math.round(offsetTop + inline.offsetTop)}px`,
    left: `${Math.round(offsetLeft + inline.offsetLeft)}px`,
    width: `${Math.round(entityRect.width)}px`,
    height: `${Math.round(entityRect.height)}px`
  }
};

const getLightRadiusOffset = (offsetTop, offsetLeft, tileRect, entityLightRadius) => {
  // inline offset
  const lightWidth = tileRect.width * entityLightRadius;
  const lightHeight = tileRect.height * entityLightRadius;

  const inline = {
    offsetTop: - lightHeight*.5 + tileRect.height*.5,
    offsetLeft: - lightWidth*.5 + tileRect.width*.5,
  };

  return {
    top: `${Math.round(offsetTop + inline.offsetTop)}px`,
    left: `${Math.round(offsetLeft + inline.offsetLeft)}px`,
    width: `${Math.round(lightWidth)}px`,
    height: `${Math.round(lightHeight)}px`,
    borderRadius: `${(lightHeight*.5)}px ${(lightWidth*.5)}px`
  }
};
