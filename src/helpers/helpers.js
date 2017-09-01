import React from 'react';
import { bindActionCreators } from 'redux';

export const dom = {
  setClassList: payload => {
    const {node, names, addif = true} = payload;
    const list = Array.isArray(names) ? names : [names];
    const fn = (addif !== false) ? 'add' : 'remove';
    list.forEach(name => node.classList[fn](name));
  },

  getChild: (child, props, index) => {
    const key = index || 1;
    return child ? React.cloneElement(child, {...props, key}) : null;
  },

  afterNextRender: (fn, args) => {
    return setTimeout(() => fn.apply(undefined, args), 0);
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
