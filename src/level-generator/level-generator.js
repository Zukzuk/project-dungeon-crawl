import React from 'react';
import GridStuff from './grid-stuff';
import RandomWalker from './random-walker';
import TileGrid from './components/TileGrid';
import LevelGeneratorInput from './components/LevelGeneratorInput';
import './level-generator-style.scss';

class LevelGeneratorApp extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    //debugger;
    const level = this.state.level;
    const width = level.grid[0].length;
    const height = level.grid.length;
    const boundStartLevel = this.startLevel.bind(this);
    const boundInputChange = this.inputChange.bind(this);

    return <div id="levelGenerator">
             <LevelGeneratorInput clickStart={boundStartLevel} values={this.state.input} inputChange={boundInputChange} />
             <TileGrid grid={level.grid} cursor={level.cursor} gridInfo={this.state.gridInfo}
                     tileSize={ Math.min( (window.innerHeight - 16) / height, (window.innerWidth - 16) / width )} />
           </div>
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
    stopStepper()
  }
  initialize(width = 100, height = 50, maxSteps = width * height, seed) {
    // var width = 100;
    // var height = 50;
    // var maxSteps = width * height;
    // var seed = undefined;

    if( this.state ) {
      const input = this.state.input;
      width = parseInt(input.width) || width;
      height = parseInt(input.height) || height;
      maxSteps = parseInt(input.maxSteps) || maxSteps;
      seed = parseInt(input.seed) || seed;
    }
    const size = [width, height];
    //const size = this.props.size || [50, 25];
    this.setState({
      input: {width: width, height: height, maxSteps: maxSteps, seed: undefined},
      gridSize: size,
      level: this.generateLevel(width, height, seed),
      step: 0,
      stepInterval: null,
      maxSteps: maxSteps,
      gridInfo: () => {return {}},
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
    }
    this.setState({input: newInput});
  }
  startLevel() {
    this.stopStepper(); // in case it is running.
    this.initialize();
    this.startStepper();
  }
  generateLevel(x, y, seed) {
    return new RandomWalker(x, y, seed);
  }
  levelStepper() {
    if( this.state.step >= this.state.maxSteps ) {
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
  startStepper() {
    if( ! this.state.stepInterval ) {
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
}

export { LevelGeneratorApp as default };
