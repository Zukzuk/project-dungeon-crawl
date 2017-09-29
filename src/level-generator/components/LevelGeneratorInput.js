import React from 'react'

export default class LevelGeneratorInput extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    const inputChange = this.props.inputChange;
    return <div id="levelGeneratorInput">
             <div><label>width: <input id="lgiWidth" value={this.props.values.width} onChange={inputChange} /></label></div>
             <div><label>height: <input id="lgiHeight" value={this.props.values.height} onChange={inputChange} /></label></div>
             <div><label>iterations: <input id="lgiIterations" value={this.props.values.iterations} onChange={inputChange} /></label></div>
             <div><label>seed: <input id="lgiSeed" value={this.props.values.seed} onChange={inputChange} /></label></div>
             <div>
               <input type="button" id="lgiStart" value="start" onClick={this.props.clickStart} />
               <input type="button" id="lgiPauze" value={(this.props.isRunning ? "pauze" : "run")} onClick={this.props.clickPauze} />
             </div>
           </div>
  }
}
