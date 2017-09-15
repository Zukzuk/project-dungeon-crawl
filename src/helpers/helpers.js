import React from 'react';
import { bindActionCreators } from 'redux';

let collisionBuffer = {};

export const dom = {

  toArray: obj => {
    let array = [];
    const _obj = (obj.length === undefined) ? [obj] : obj;
    // iterate backwards ensuring that length is an UInt32
    for (let i = _obj.length >>> 0; i--;) {
      array[i] = _obj[i];
    }
    return array;
  },

  setClassList: payload => {
    const {nodes, names, addif = true} = payload;
    const elements = Array.isArray(nodes) ? nodes : [nodes];
    const list = Array.isArray(names) ? names : [names];
    const fn = (addif !== false) ? 'add' : 'remove';
    elements.forEach(element => list.forEach(name => element.classList[fn](name)) );
  },

  getChild: (child, props, index) => {
    const key = index || 1;
    return child ? React.cloneElement(child, {...props, key}) : null;
  },

  afterNextRender: (fn, args) => {
    setTimeout(() => {
      return fn.apply(undefined, args);
    }, 100);
  },

  getComponent: dom => {
    const internalInstance = dom[Object.keys(dom).find(key =>
      key.startsWith('__reactInternalInstance$'))];
    if (!internalInstance) return null;
    return { comp: internalInstance._currentElement, elm: dom };
  },

  computeCollision: (roomSelector, lightSelector, tileSize, position, radius) => {
    // get components
    const room = collisionBuffer.room || dom.getComponent(document.querySelector(roomSelector));
    const light = collisionBuffer.light || dom.getComponent(document.querySelector(lightSelector));
    // flatten the room into tiles
    const tiles = collisionBuffer.tiles || Array.prototype.concat.apply([], room.comp.props.children);
    // buffer components
    collisionBuffer = { room, light, tiles };
    // get the tile where the light is centered
    const lightTile = tiles[position].props.children.props;
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
      let collision;
      const distX = Math.abs(circle.x - rect.x-rect.w/2);
      const distY = Math.abs(circle.y - rect.y-rect.h/2);
      if (distX > (rect.w/2 + circle.r) || distY > (rect.h/2 + circle.r)) {
        collision = false;
      } else if (distX <= (rect.w/2) || distY <= (rect.h/2)) {
        collision = true;
      } else {
        const dx = distX - rect.w / 2;
        const dy = distY - rect.h / 2;
        collision = dx * dx + dy * dy <= (circle.r * circle.r);
      }

      const tileElm = room.elm.querySelector(`#tile${i}`);
      if (collision) {
        tileElm.setAttribute('light-radius', 'bright');
      } else if (_.get(tileElm, 'attributes[\'light-radius\'].nodeValue') === 'bright') {
        tileElm.setAttribute('light-radius', 'dim');
      }
    }
  },

  resetCollision: () => {
    if (collisionBuffer.tiles) {
      for (let i = 0; i < collisionBuffer.tiles.length; i++) {
        const tileElm = collisionBuffer.room.elm.querySelector(`#tile${i}`);
        if (_.get(tileElm, 'attributes[\'light-radius\'].nodeValue') === 'dim') {
          tileElm.removeAttribute('light-radius');
        }
      }
      collisionBuffer = {};
    }
  },

  getComputedSize: node => {
    const style = getComputedStyle(node);
    const sumOfPixels = pixels => (
      pixels.split('px').reduce((result, amount) => {
        if (Number(amount)) result += Number(amount);
        return result;
      }, 0)
    );
    return {
      width: sumOfPixels(style['width'] + style['margin-left'] + style['margin-right'] + style['padding-left'] + style['padding-right']),
      height: sumOfPixels(style['height'] + style['margin-top'] + style['margin-bottom'] + style['padding-top'] + style['padding-bottom']),
    };
  }
};

export const math = {
  factors: (size, amount) => Array
    .from(Array(size), (_, i) => i)
    .filter(i => size % i === 0 && i !== 1 && i !== amount)
};

export const redux = {
  mapState: (state, slices) => {
    return slices.reduce((result, slice) => {
      result.state[slice] = state[slice];
      return result;
    }, { state: {} });
  },

  mapActions: (dispatch, actions) => {
    return Object.keys(actions).reduce((result, key) => {
      result.actions[key] = bindActionCreators({ ...actions[key] }, dispatch);
      return result;
    }, { actions: {} });
  }
};
