import React from 'react';
import GridStuff from './grid-stuff';
import RandomWalker from './random-walker';
import TileGrid from './components/TileGrid';
import './level-generator-style.scss';

class LevelGeneratorApp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    //debugger;
    const level = this.state.level;
    const width = level.grid[0].length;
    const height = level.grid.length;
    return <TileGrid grid={level.grid} cursor={level.cursor} gridInfo={this.state.gridInfo}
                     tileSize={ Math.min( (window.innerHeight - 16) / height, (window.innerWidth - 16) / width )} />

  }
  componentWillMount() {
    const size = this.props.size || [50, 25];
    this.setState({
      gridSize: size,
      level: this.props.level || this.generateLevel(...size),
      step: 0,
      stepInterval: null,
      maxSteps: this.props.maxSteps || size[0] * size[1],
      gridInfo: () => {return {}},
    });
  }
  componentDidMount() {
    var that = this; // time for some closure
    document.body.onkeyup = function(e){
      if(e.keyCode == 32){
        //const [width, height] = this.state.gridSize;
        //const level = this.state.level;
        that.setState({
          stepInterval: window.setInterval(that.levelStepper.bind(that), 100),
        });
      }
    }
  }
  componentWillUnmount() {
    document.body.onkeyup = null;
    if( this.state.stepInterval ) {
      window.clearInterval(this.state.stepInterval);
      this.setState({
        stepInterval: null,
      });
    }
  }
  generateLevel(x, y, seed) {
    return new RandomWalker(x, y, seed);
  }
  levelStepper() {
    if( this.state.step === this.state.maxSteps ) {
      window.clearInterval(this.state.stepInterval);
      this.setState({
        stepInterval: null,
      });
    } else {
      const step = this.state.step + 1;
      const newState = {step: step}
      this.state.level.step();
      if( step % 10 === 0 ) {
        const gridInfoValues = {};
        const level = this.state.level;
        gridInfoValues.step = step;
        gridInfoValues.gridSize = JSON.stringify(this.state.gridSize);
        gridInfoValues.seed = level.seed;
        gridInfoValues.levelSize = GridStuff.sumGrid(level.grid);
        gridInfoValues.efficiency = (gridInfoValues.levelSize/step).toFixed(2);
        newState.gridInfo = () => {return gridInfoValues};
      }
      this.setState(newState);
    }
  }
}

export { LevelGeneratorApp as default };

//window.generateLevel = (x, y, seed) => {
//  const rw = new RandomWalker(x, y, seed);
//  //rw.walk();
//  return rw;
//}


// window.showLevel = (grid, cursor, gridInfo = () => {return {}} ) => {
//   //debugger;
//   ReactDOM.render(
//     <LevelGeneratorApp grid={grid} cursor={cursor} gridInfo={gridInfo} /> ,
//     document.getElementById('app')
//   );
// };


//showLevel( generateLevel(200, 100).grid );
//showLevel( [[]] );


// window.stepped = 0;
// window.maxSteps = 5000;
// window.stepper = (level) => {
//   if( window.stepped === window.maxSteps ) {
//     window.stepped = 0;
//     window.clearInterval(window.stepperInterval);
//   } else {
//     window.stepped++;
//     level.step();
//     if( window.stepped % 10 === 0 ) {
//       const giValues = {};
//       giValues.step = window.stepped;
//       giValues.gridSize = JSON.stringify([level.grid[0].length, level.grid.length]);
//       giValues.seed = level.seed;
//       giValues.levelSize = GridStuff.sumGrid(level.grid);
//       giValues.efficiency = (giValues.levelSize/window.stepped).toFixed(2);
//       showLevel(level.grid, level.cursor, () => {return giValues} );
//     }
//   }
// };
