import { dom } from './helpers';

let collisionBuffer;

export default {

  getBuffer: (roomId) => {
    if (isNaN(roomId)) return;
    // get components
    const component = dom.getComponent(document.querySelector(`#room${roomId}`));
    // flatten the room into tiles
    const tiles = component.instance.props.children ? Array.prototype.concat.apply([], component.instance.props.children) : null;
    // buffer components
    if (!component || !tiles) return;
    return { component, tiles };
  },

  tileCollision: (buffer, tileId, radius, tileSize) => {
    if (!buffer || isNaN(tileId) || isNaN(radius) || isNaN(tileSize)) return;

    // get the tile where the light is centered
    const offsetPosition = buffer.tiles[0].props.children.props.id;
    const normalizedPosition = tileId - offsetPosition;
    const lightTile = buffer.tiles[normalizedPosition].props.children.props;

    // create bounding circle from light
    const circle = {
      x: tileSize + (tileSize*(lightTile.column-1)),
      y: tileSize + (tileSize*(lightTile.row-1)),
      r: radius * tileSize/2
    };

    for (let i = 0; i < buffer.tiles.length; i++) {
      // create bounding box from tile
      const tile = buffer.tiles[i].props.children.props;
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

      const tileElm = buffer.component.elm.querySelector(`#tile${i+offsetPosition}`);
      if (ratio) {
        tileElm.setAttribute('data-light', 'on');
        tileElm.style['opacity'] = (ratio > .62) ? 1 : (ratio < .2) ? .2 : ratio;
      } else if (_.get(tileElm, 'attributes[\'data-light\'].nodeValue') === 'on') {
        tileElm.setAttribute('data-light', 'off');
      }
    }
  },

  resetCollision: (collisionBuffer) => {
    if (collisionBuffer) {
      const offsetPosition = _.get(collisionBuffer, 'tiles[0].props.children.props.id');
      for (let i = 0; i < collisionBuffer.tiles.length; i++) {
        const tileElm = collisionBuffer.component.elm.querySelector(`#tile${i+offsetPosition}`);
        if (tileElm) tileElm.setAttribute('data-light', 'fogofwar');
      }
    }
    return null;
  }
};
