import React from 'react';
import { bindActionCreators } from 'redux';
import EntityActions from '../state/EntityActions';
import PlayerActions from '../state/PlayerActions';
import TileActions from '../state/TileActions';
import GameMenuActions from '../state/GameMenuActions';

export const dom = {

  getComponent: dom => {
    const internalInstance = dom[Object.keys(dom).find(key =>
      key.startsWith('__reactInternalInstance$'))];
    if (!internalInstance) return null;
    return { instance: internalInstance._currentElement, elm: dom };
  },

  getComputedSize: node => {
    const style = getComputedStyle(node);
    const sumOfPixels = pixels => {
      return pixels.split('px').reduce((result, amount) => {
        if (Number(amount)) result += Number(amount);
        return result;
      }, 0)
    };

    return {
      width: sumOfPixels(style['width'] + style['margin-left'] + style['margin-right'] + style['padding-left'] + style['padding-right']),
      height: sumOfPixels(style['height'] + style['margin-top'] + style['margin-bottom'] + style['padding-top'] + style['padding-bottom']),
    };
  }
};

export const react = {
  stateDidUpdate: (current, next, slice) => {
    const doUpdate = _.get(next, `state[${slice}]`) !== _.get(current, `state[${slice}]`);
    if (doUpdate) console.log(slice, ':', _.get(current, `state[${slice}]`), '=>', _.get(next, `state[${slice}]`));
    return _.get(current, `state[${slice}]`) !== _.get(next, `state[${slice}]`);
  }
};

export const math = {
  rand: (min, max) => {
    return Math.random() * (max - min) + min;
  }
};

export const redux = {
  mapState: (state, slices) => {
    return slices.reduce((result, slice) => {
      result.state[slice] = state[slice];
      return result;
    }, { state: {} });
  },

  mapActions: (dispatch, actions) => {
    const imports = {
      Entity: EntityActions,
      Player: PlayerActions,
      Tile: TileActions,
      GameMenu: GameMenuActions
    };

    return actions.reduce((result, action) => {
      const importedAction = imports[action];
      if (!importedAction) throw new Error(`Make sure you import ${action}Actions into helpers.js`);
      result.actions[action] = bindActionCreators(importedAction, dispatch);
      return result;
    }, { actions: {} });
  }
};
