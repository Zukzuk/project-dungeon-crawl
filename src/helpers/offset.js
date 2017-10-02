export default {

  playerOffset: (component, props) => {
    if (!component) return;

    const entityState = props.state.Entity['Player'];
    const entityPosition = entityState.spawns[0].position.tileId;
    const entityRelativeSize = entityState.relativeSize;
    const entityAlignment = entityState.alignment;
    const hasPerspective = props.state.GameBoard.hasPerspective;

    // board offset
    const room = component.elm;
    const tile = room.querySelector(`#tile${entityPosition}`);
    if (!tile) return false;
    const offsetTop = tile.offsetTop + room.offsetTop;
    const offsetLeft = tile.offsetLeft + room.offsetLeft;

    // tile
    const tileRect = {
      width: props.state.Tile.size,
      height: props.state.Tile.size
    };

    // entity
    const entityRect = {
      width: tileRect.width * entityRelativeSize.width,
      height: tileRect.height * entityRelativeSize.height
    };

    return getEntityOffset(offsetTop, offsetLeft, tileRect, entityRect, entityAlignment, hasPerspective);
  },

  lightRadiusOffset: (component, props) => {
    if (!component) return;

    const entityState = props.state.Entity['Player'];
    const entityPosition = entityState.spawns[0].position.tileId;
    const entityLightRadius = entityState.spawns[0].lightRadius || 0;

    // board offset
    const room = component.elm;
    const tile = room.querySelector(`#tile${entityPosition}`);
    if (!tile) return false;
    const offsetTop = tile.offsetTop + room.offsetTop;
    const offsetLeft = tile.offsetLeft + room.offsetLeft;

    // tile
    const tileRect = {
      width: props.state.Tile.size,
      height: props.state.Tile.size
    };

    return getLightRadiusOffset(offsetTop, offsetLeft, tileRect, entityLightRadius);
  }
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
    borderRadius: `${(lightHeight*.5)}px ${(lightWidth*.5)}px`,
    //boxShadow: `0 0 ${lightWidth/2}px ${Math.round(lightWidth)}px papayawhip`
  }
};

