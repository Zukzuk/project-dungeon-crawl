import { TILE_CONSTANTS } from '../../constants.js';

export default {
  currentId: 0,
  style: undefined,
  size: undefined,
  cssClass: TILE_CONSTANTS.TILE_DEFAULT_CLASS,
  Tiles: Array.apply(null, Array(20*20)).map( () => {return {highlight: null};} ),
}
