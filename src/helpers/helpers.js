import React from 'react';
import { bindActionCreators } from 'redux';
import EntityActions from '../redux/actions/EntityActions';
import PlayerActions from '../redux/actions/PlayerActions';
import TileActions from '../redux/actions/TileActions';
import GameMenuActions from '../redux/actions/GameMenuActions';

export const dom = {

  afterNextRender: fn => {
    setTimeout(() => fn(), 100);
  },

  getComponent: dom => {
    const internalInstance = dom[Object.keys(dom).find(key =>
      key.startsWith('__reactInternalInstance$'))];
    if (!internalInstance) return null;
    return { comp: internalInstance._currentElement, elm: dom };
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

export const react = {
  stateDidUpdate: (current, next, slice) => {
    return _.get(next, `state[${slice}]`) !== _.get(current, `state[${slice}]`);
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
