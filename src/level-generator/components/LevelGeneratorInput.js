import React from 'react'

export default class LevelGeneratorInput extends React.PureComponent {

  render() {
    const inputChange = this.props.inputChange;
    const values = this.props.values;
    //debugger;
    return <div id="levelGeneratorInput">
             <div><label>width: <input id="lgiWidth" value={values.width} onChange={inputChange} /></label></div>
             <div><label>height: <input id="lgiHeight" value={values.height} onChange={inputChange} /></label></div>
             <div><label>iterations: <input id="lgiIterations" value={values.iterations} onChange={inputChange} /></label></div>
             <div><label>seed: <input id="lgiSeed" value={values.seed} onChange={inputChange} /></label></div>
             <div>
               <input type="button" id="lgiStart" value="start" onClick={this.props.clickStart} />
               <input type="button" id="lgiPauze" value={(this.props.isRunning ? "pauze" : "run")} onClick={this.props.clickPauze} />
               <input type="button" id="lgiStep" value="step" onClick={this.props.clickStep} />
             </div>
             <div><label>show values: <input id="lgiShowValues" type="checkbox" checked={values.showGridValues} onChange={inputChange} /></label></div>
           </div>
  }
}
