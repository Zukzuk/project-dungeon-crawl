import React from 'react';
import RandomWalker from './random-walker';
import ConnectedRooms from './connected-rooms.js';
import TileGrid from './components/TileGrid';
import LevelGeneratorInput from './components/LevelGeneratorInput';
import './level-generator-style.scss';


const classes = {
  RandomWalker,
  ConnectedRooms,
};
class DynamicClass {
  constructor (className, ...args) {
    return new classes[className](...args);
  }
}

class LevelGeneratorApp extends React.PureComponent {
  render() {
    //debugger;
    const state = this.state;
    const level = state.level;
    const grid = level.grid;
    const width = grid.width();
    const height = grid.height();
    const boundStartLevel = () => this.startLevel();
    const boundInputChange = (event) => this.inputChange(event);
    const boundToggleStepper = () => this.toggleStepper();
    const boundLevelStepper = () => this.levelStepper();
    const boundDumpLevel = () => this.dumpGrid();

    return ( <div id="levelGenerator">
             <LevelGeneratorInput clickStart={boundStartLevel}
                                  clickPauze={boundToggleStepper}
                                  clickStep={boundLevelStepper}
                                  clickDump={boundDumpLevel}
                     isRunning={!!state.stepInterval}
                     values={state.input} inputChange={boundInputChange} />
             <TileGrid grid={grid.rawGrid} prevGrid={state.prevGrid} cursor={level.cursor} gridInfo={state.gridInfo}
                     tileSize={Math.min( (window.innerHeight - 16) / (height * 1.01), (window.innerWidth - 16) / (width * 1.01) )}
                     showGridValues={state.input.showGridValues}
             />
           </div> );
  }
  componentWillMount() {
    this.initialize();
  }
  componentDidMount() {
    //const boundStartStepper = this.startStepper.bind(this);
    // document.body.onkeyup = function(e){
    //   // look for spacebar
    //   if(e.keyCode == 32){
    //     // start stepping through new level, save interval in state.
    //     boundStartStepper();
    //   }
    // }
  }
  componentWillUnmount() {
    document.body.onkeyup = null;
    this.stopStepper();
  }
  initialize(width = 100, height = 50, maxSteps = width * height, seed, showGridValues=false) {
    if( this.state ) {
      const input = this.state.input;
      width = parseInt(input.width) || width;
      height = parseInt(input.height) || height;
      maxSteps = parseInt(input.maxSteps) || maxSteps;
      seed = parseInt(input.seed) || seed;
      showGridValues = input.showGridValues;
    }
    const size = [width, height];
    const level = this.generateLevel(width, height, seed);
    this.setState({
      input: {width: width.toString(), height: height.toString(), maxSteps: maxSteps.toString(), seed: seed, showGridValues: showGridValues},
      gridSize: size,
      level: level,
      step: 0,
      stepInterval: null,
      maxSteps: maxSteps,
      gridInfo: () => {return {};},
      algorithm: "ConnectedRooms",
    });
  }
  inputChange(event) {
    const newInput = {...this.state.input};
    const newValue = event.target.value;
    switch( event.target.id ) {
      case "lgiWidth":
        newInput.width = newValue;
        break;
      case "lgiHeight":
        newInput.height = newValue;
        break;
      case "lgiIterations":
        newInput.maxSteps = newValue;
        break;
      case "lgiSeed":
        newInput.seed = newValue;
        if( newInput.seed === "" )
          newInput.seed = undefined;
        break;
      case "lgiShowValues":
        newInput.showGridValues = event.target.checked;
      case "lgiAlgorithm":
        newInput.algorithm = event.target.value;
    }
    this.setState({input: newInput});
  }
  startLevel() {
    this.stopStepper(); // in case it is running.
    this.initialize();
    this.startStepper(true);
  }
  resetLevel() {
    this.stopStepper(); // in case it is running.
    this.initialize();
  }
  generateLevel(x, y, seed) {
    //return new RandomWalker(x, y, seed);
    //return new ConnectedRooms(x, y, seed);
    return new DynamicClass(this.state && this.state.input.algorithm || "ConnectedRooms", x, y, seed);
  }
  levelStepper() {
    //if( this.state.step >= this.state.maxSteps ) {
    if( this.state.level.isCompleted() ) {
      window.clearInterval(this.state.stepInterval);
      this.setState({
        stepInterval: null,
      });
    } else {
      //const step = this.state.step + 1;
      const newState = {};
      const level = this.state.level;
      const levelCompleted = level.isCompleted();
      const gridInfoInterval = this.state.gridInfoInterval || 10;
      newState.prevGrid = this.state.level.grid.copyRawGrid();
      level.step();
      //if( step % gridInfoInterval === 0 ) {
        const gridInfoValues = level.gridInfo();
        newState.gridInfo = () => gridInfoValues; // setting gridInfo does cause the tiles in DOM to be updated.
      //}
      this.setState(newState);
    }
  }
  startStepper(forceStart) {
    if( ! this.state.stepInterval || forceStart ) {
      this.setState({
        stepInterval: window.setInterval(this.levelStepper.bind(this), 10),
      });
    }
  }
  stopStepper() {
    if( this.state.stepInterval ) {
      window.clearInterval(this.state.stepInterval);
      this.setState({
        stepInterval: null,
      });
    }
  }
  toggleStepper() {
    if( this.state.stepInterval )
      this.stopStepper();
    else
      this.startStepper();
  }
  dumpGrid() {
    console.log(this.state.level.grid);
  }
}

export { LevelGeneratorApp as default };
