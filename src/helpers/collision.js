import { dom } from './helpers';

let collisionBuffer = {};

export default {

  tileCollision: (roomSelector, lightSelector, tileSize, roomId, position, radius) => {
    if (isNaN(tileSize) || isNaN(roomId) || isNaN(position) || isNaN(radius)) return;

    // get components
    const room = collisionBuffer.room || dom.getComponent(document.querySelector(roomSelector));
    const light = collisionBuffer.light || dom.getComponent(document.querySelector(lightSelector));
    // flatten the room into tiles
    const tiles = collisionBuffer.tiles
      ? collisionBuffer.tiles : room.comp.props.children
        ? Array.prototype.concat.apply([], room.comp.props.children) : null;
    if (!room || !light || !tiles) return;

    // buffer components
    collisionBuffer = { roomId, room, light, tiles };

    // get the tile where the light is centered
    const offsetPosition = tiles[0].props.children.props.id;
    const normalizedPosition = position - offsetPosition;
    const lightTile = tiles[normalizedPosition].props.children.props;

    // create bounding circle from light
    const circle = {
      x: tileSize + (tileSize*(lightTile.column-1)),
      y: tileSize + (tileSize*(lightTile.row-1)),
      r: radius * tileSize/2
    };

    for (let i = 0; i < tiles.length; i++) {
      // create bounding box from tile
      const tile = tiles[i].props.children.props;
      const rect = {
        x: tileSize/2 + (tileSize*(tile.column-1)),
        y: tileSize/2 + (tileSize*(tile.row-1)),
        w: tileSize,
        h: tileSize
      };

      // calculate collision
      const distX = Math.abs(circle.x - rect.x-rect.w/2);
      const distY = Math.abs(circle.y - rect.y-rect.h/2);
      const dx = distX - rect.w / 2;
      const dy = distY - rect.h / 2;
      const ratio = Math.max(0, 1 - ((dx * dx + dy * dy) / (circle.r * circle.r)) );

      const tileElm = room.elm.querySelector(`#tile${i+offsetPosition}`);
      if (ratio) {
        tileElm.setAttribute('data-light', 'on');
        tileElm.style['opacity'] = (ratio > .62) ? 1 : (ratio < .2) ? .2 : ratio;
      } else if (_.get(tileElm, 'attributes[\'data-light\'].nodeValue') === 'on') {
        tileElm.setAttribute('data-light', 'off');
      }
    }
  },

  resetAndRecalculate: (callback, props) => {
    if (!_.isEmpty(collisionBuffer)) {
      const offsetPosition = _.get(collisionBuffer, 'tiles[0].props.children.props.id');
      for (let i = 0; i < collisionBuffer.tiles.length; i++) {
        const tileElm = collisionBuffer.room.elm.querySelector(`#tile${i+offsetPosition}`);
        if (tileElm) tileElm.setAttribute('data-light', 'fogofwar');
      }
      collisionBuffer = {};
    }
    callback(props);
  }
};
