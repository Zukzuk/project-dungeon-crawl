import React from 'react';
import {bindActionCreators} from 'redux';
import EntityActions from '../state/EntityActions';
import PlayerActions from '../state/PlayerActions';
import TileActions from '../state/TileActions';
import GameMenuActions from '../state/GameMenuActions';

export const _dom_ = {
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

export const _react_ = {
  stateDidUpdate: (context, method, next, slice, color) => {
    const colorString = color ? 'background: #EEE; color: red' : '';
    const name = context.constructor.name;
    const currentState = _.get(context.props, `state[${slice}]`);
    const nextState = _.get(next, `state[${slice}]`);
    const doUpdate = nextState !== currentState;
    if (doUpdate) console.log(`%c ${name}.${method} reacting to '${slice}' update: ${currentState} => ${nextState}`, colorString);
    return currentState !== nextState;
  },

  getComponent: elm => {
    const internalInstance = elm[Object.keys(elm).find(key =>
      key.startsWith('__reactInternalInstance$'))];
    if (!internalInstance) return null;
    return {instance: internalInstance._currentElement, elm};
  }
};

export const _math_ = {
  rand: (min, max) => {
    return Math.random() * (max - min) + min;
  }
};

export const _redux_ = {
  mapState: (state, slices) => {
    return slices.reduce((result, slice) => {
      result.state[slice] = state[slice];
      return result;
    }, {state: {}});
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
    }, {actions: {}});
  }
};
