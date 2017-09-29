import {
  ENTITY_CONSTANTS,
} from '../constants';
import EntityActions from './EntityActions';
import { dom } from '../helpers/helpers';

export default {

  // offsetAllEntities: name => {
  //   return (dispatch, getState) => {
  //     // get all entities on game-board
  //     const target = name ? [name] : Object.keys(getState().Entity);
  //     target.forEach(name => {
  //       document.querySelectorAll('.' + name.toLowerCase())
  //         .forEach(entity => {
  //           const id = Number(entity.id.replace(name.toLowerCase(), ''));
  //           return EntityActions.entityOffset(dispatch, getState, name, id);
  //         });
  //     });
  //   }
  // },
  //
  // entityOffset: (dispatch, getState, name, id) => {
  //   dispatch({
  //     type: ENTITY_CONSTANTS.OFFSET_SET, name, id,
  //     payload: getStyle(getState(), name, id)
  //   });
  // }
};

