import collision from './collision';

export default {

  roomCollision: (room, rooms, ignored) => {
    for (var i = 0; i < rooms.length; i++) {
      if (i == ignored) continue;
      const check = rooms[i];
      if (!((room.x + room.w < check.x) || (room.x > check.x + check.w) || (room.y + room.h < check.y) || (room.y > check.y + check.h))) return true;
    }
    return false;
  },

  roomSquash: (rooms, tileSize) => {
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < rooms.length; j++) {
        var room = rooms[j];
        while (true) {
          var old_position = {
            x: room.x,
            y: room.y
          };
          if (room.x > 1) room.x -= tileSize;
          if (room.y > 1) room.y -= tileSize;
          if ((room.x < tileSize) && (room.y < tileSize)) break;
          if (collision.roomCollision(room, rooms, j)) {
            room.x = old_position.x;
            room.y = old_position.y;
            break;
          }
        }
      }
    }
  },

  tileCollision: (component, tileId, radius, tileSize) => {
    if (!component || isNaN(tileId) || isNaN(radius) || isNaN(tileSize)) return;
    // flatten the room into tiles
    const tiles = component.instance.props.children ? Array.prototype.concat.apply([], component.instance.props.children) : null;

    // get the tile where the light is centered
    const offsetIndex = tiles[0].props.children.props.id;
    const normalized = tileId - offsetIndex;
    const currentTile = tiles[normalized].props.children.props;

    // create bounding circle from light
    const circle = {
      x: tileSize + (tileSize*(currentTile.x-1)),
      y: tileSize + (tileSize*(currentTile.y-1)),
      r: radius * tileSize/2
    };

    for (let i = 0; i < tiles.length; i++) {
      // create bounding box from tile
      const tile = tiles[i].props.children.props;
      const rect = {
        x: tileSize/2 + (tileSize*(tile.x-1)),
        y: tileSize/2 + (tileSize*(tile.y-1)),
        w: tileSize,
        h: tileSize
      };

      // calculate collision
      const distX = Math.abs(circle.x - rect.x-rect.w/2);
      const distY = Math.abs(circle.y - rect.y-rect.h/2);
      const dx = distX - rect.w / 2;
      const dy = distY - rect.h / 2;
      const ratio = Math.max(0, 1 - ((dx * dx + dy * dy) / (circle.r * circle.r)) );

      const tileElm = component.elm.querySelector(`#tile${i+offsetIndex}`);
      if (ratio) {
        tileElm.setAttribute('data-light', 'on');
        tileElm.style['opacity'] = (ratio > .72) ? 1 : (ratio < .2) ? .2 : ratio;
      } else if (_.get(tileElm, 'attributes[\'data-light\'].nodeValue') === 'on') {
        tileElm.setAttribute('data-light', 'off');
      }
    }
  },

  resetCollision: component => {
    if (component) {
      const room = component.elm;
      room.querySelectorAll('[data-light]').forEach(tile => {
        tile.setAttribute('data-light', 'fogofwar');
      });
    }
    return null;
  },

  getTileIndex: (component, tileId, pressedKey) => {
    if (!component || isNaN(tileId) || !pressedKey) return;
    // flatten the room into tiles
    const tiles = component.instance.props.children ? Array.prototype.concat.apply([], component.instance.props.children) : null;
    const offsetIndex = tiles[0].props.children.props.id;

    const normalized = tileId - offsetIndex;
    const currentTile = tiles[normalized].props.children.props;
    const coord = { x: currentTile.x, y: currentTile.y };

    switch (pressedKey) {
      case "ArrowDown":
        coord.y += 1;
        break;
      case "ArrowUp":
        coord.y -= 1;
        break;
      case "ArrowLeft":
        coord.x -= 1;
        break;
      case "ArrowRight":
        coord.x += 1;
        break;
      default:
        return; // Quit when this doesn't handle the key event.
    }

    const selectedTile = component.elm.querySelector(`[data-coord="${coord.x}-${coord.y}"]`);
    return selectedTile ? Number(selectedTile.id.replace('tile', '')) : undefined;
  }
};
