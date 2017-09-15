import React from 'react';
import ReactDOM from 'react-dom';
import { bindActionCreators } from 'redux';

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
    return setTimeout(() => fn.apply(undefined, args), 100);
  },

  getComponent: dom => {
    const internalInstance = dom[Object.keys(dom).find(key =>
      key.startsWith('__reactInternalInstance$'))];
    if (!internalInstance) return null;
    return { comp: internalInstance._currentElement, elm: dom };
  },

  computeCollision: (room, tileSize, light, position) => {
    // flatten the room into tiles
    const tiles = Array.prototype.concat.apply([], room.comp.props.children);
    // get the tile where the light is centered
    const lightTile = tiles[position].props.children.props;
    // create bounding circle from light
    const { width } = light.comp.props.style;
    const radius = Number(_.trimEnd(width, 'px'))/2;
    const circle = {
      x: tileSize + (tileSize*(lightTile.column-1)),
      y: tileSize + (tileSize*(lightTile.row-1)),
      r: radius
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
      if (collision) tileElm.setAttribute('light-radius', true);
      else tileElm.removeAttribute('light-radius');
    }
  },

  optimizedResize: () => {
    // handle resize
    (() => {
      const throttle = (type, name, obj) => {
        obj = obj || window;
        let running = false;
        obj.addEventListener(type, () => {
          if (running) return;
          running = true;
          requestAnimationFrame(() => {
            obj.dispatchEvent(new CustomEvent(name));
            running = false;
          });
        });
      };

      /* init - you can init any event */
      throttle('resize', 'optimizedResize');
    })();
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
  },

  updateArray: (array, action, key) => {
    return array.map( (item, index) => {
      if(index !== action.id) return item;
      item[key] = action.payload;
      return item;
    });
  }
};
