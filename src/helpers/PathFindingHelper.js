
import PF from 'pathfinding';

import PlayerActions from '../redux/actions/PlayerActions';
import ENTITY_CONSTANTS from '../constants';

export default {
  getRouteFromState(sourceIndex, destinationIndex, state) {
    const grid = gridFromState(state);
    return getRoute(sourceIndex, destinationIndex, grid);
  },
  getRoute(sourceIndex, destinationIndex, grid) {
    // grid must be a rectangular array (array(columns) of arrays(rows)) containing zeroes(walkable) and ones(blocked)
    // eg. [[0,0,0],
    //      [1,1,0],
    //      [0,0,0]];
    // indexes are from top left (0) to bottom right, rows first
    // i.e. [[0,1,2],
    //       [3,4,5],
    //       [6,7,8]];
    return getRoute(sourceIndex, destinationIndex, grid);
  }
};

const gridFromState = (state) => {
  const columns = state.GameBoard.columns;
  const grid = generateGrid(state.GameBoard);

  const obstacles = [];
  obstacles.splice(obstacles.length, 0, ...state.Entity.Minion.spawns.map((minion) => minion.position));
  obstacles.splice(obstacles.length, 0, ...state.Entity.Player.spawns.map((player) => player.position));
  blockTiles(grid, obstacles, columns);

  return grid;
};

const getRoute = (sourceIndex, destinationIndex, grid) => {
  const columns = grid[0].length;
  const source = indexToXY(sourceIndex, columns);
  const destination = indexToXY(destinationIndex, columns);

  const routeXY = calculateRoute(source, destination, grid);
  const route = routeXY.map( (xy) => {return XYtoIndex(xy, columns);} );

  return route;
}

const generateGrid = ( {columns, rows}, value = 0 ) => {
  // generate array (colums) containing arrays (rows), filled with zeros
  const row = Array.apply(null, Array(rows)).map( () => value );
  return Array.apply(null, Array(columns)).map( () => row.slice() );
};
const blockTiles = (grid, blockedTiles, columns) => {
  blockedTiles.forEach( (index) => {
    grid[Math.floor(index/columns)][index%columns] = 1;
  });
};
const indexToXY = (n, width) => { return [n%width, Math.floor(n/width)]; };
const XYtoIndex = (xy, width) => { return xy[0] + xy[1] * width; };

const calculateRoute = (source, destination, grid) => {
  grid = new PF.Grid(grid);
  let finder = new PF.AStarFinder({heuristic: PF.Heuristic.chebyshev});
  return finder.findPath(source[0], source[1], destination[0], destination[1], grid);
}
const planRoute = (dispatch, getState, entity) => {
  const playerIndex = getState().Entity.Player.spawns[0].position;
  const playerXY = indexToXY(playerIndex, 20);
  const destinationIndex = getState().Tile.currentId;
  const destinationXY = indexToXY(destinationIndex, 20);
  const routeXY = calculateRoute(playerXY, destinationXY, getState().Entity);
  const route = routeXY.map( (xy) => {return XYtoIndex(xy, 20);} );
  //console.log("PlayerXY:", playerXY);
  //console.log("destinationXY:", destinationXY);
  //console.log("routeXY:", routeXY);
  //const route = [20, 40, 60, 61, 62, 63, 83, 103];

  // todo: snakeHightlightTiles is a development action, which shouldn't fire in production
  snakeHightlightTiles(dispatch, route);

  dispatch({
    type: ENTITY_CONSTANTS.ENTITY_FOLLOW_PATH,
    payload: route,
    name: entity.type,
    id: entity.props.children.props.id,
  });
  dispatch(PlayerActions.updatePosition(destinationIndex));
};
