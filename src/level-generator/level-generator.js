<!DOCTYPE html>
<html>
  <head>
    <title>level generator</title>
    <!-- <script src="https://unpkg.com/babel-standalone@6/babel.min.js" charset="utf-8"></script> -->
    <script src="https://unpkg.com/react@latest/dist/react.js"></script>
    <script src="https://unpkg.com/react-dom@latest/dist/react-dom.js"></script>
    <script src="https://unpkg.com/babel-standalone@6.15.0/babel.min.js" charset="utf-8"></script>
    <script src="./random-walker.js"></script>
    <style>
    body {
      margin: 8px;
    }
    div#tileGridInfo {
      font-size: medium;
      position: absolute;
      background-color: #fff;
      opacity: 0.5;
      padding: 0.3em;
    }
    div#tileGridInfo p {
      margin-top: 0em;
      margin-bottom: 0em;
    }

    .tileRow {
    }
    .tileGrid {
      font-size: 0;
    }
    .tile {
      background-color: #bbb;
    }
    .tile.bright {
      background-color: #ddd;
    }
    .tile.highlight {
      background-color: #4d4;
    }
    .tile.highlight.bright {
      background-color: #6f6;
    }
    .tile.cursor {
      background-color: #fb4;
    }
    </style>
  </head>
  <body>
    <div id="app"></div>
    <script type="text/babel">


class App extends React.Component {
  render() {
    //debugger;
    const width = this.props.grid[0].length;
    const height = this.props.grid.length;
    return <TileGrid grid={this.props.grid} cursor={this.props.cursor} gridInfo={this.props.gridInfo}
                     tileSize={ Math.min( (window.innerHeight - 16) / height, (window.innerWidth - 16) / width )} />

  }
}
class TileGridInfo extends React.Component {
  render() {
    const items = [];
    const info = this.props.gridInfo();
    for( let key in info ) {
      if( info.hasOwnProperty(key) ) {
        items.push(<p key={key}>{key + ": " + info[key]}</p>)
      }
    }
    return <div id="tileGridInfo">{items}</div>
  }
}
class TileGrid extends React.Component {
  generateTileGrid() {
    const tiles = [];
    const grid = this.props.grid;
    const width = grid[0].length;
    const height = grid.length;
    const cursor = this.props.cursor || [undefined, undefined];
    for( let y=0; y < height; y++ ) {
      let row = [];
      for( let x=0; x < width; x++ ) {
        row.push(<Tile key={"tile" + x + "." + y} size={this.props.tileSize} tileNum={y*height+x} bright={x % 2 ^ y % 2} highlight={grid[y][x]+(cursor[0]==x&&cursor[1]==y)} />);
      }
      tiles.push(<div key={"row" + y} className="tileRow">{row}</div>);
    }
    return <div className="tileGrid"><TileGridInfo gridInfo={this.props.gridInfo} />{tiles}</div>
  };
  render() {
    return this.generateTileGrid();
  };
};
class Tile extends React.Component {
  render() {
    const classes = ["tile"];
    if ( this.props.bright )
      classes.push("bright");
    if ( this.props.highlight ) {
      if( this.props.highlight == 2 )
        classes.push("cursor")
      else
        classes.push("highlight");
    }
    return <div className={classes.join(" ")} style={{width: this.props.size, height: this.props.size, display: "inline-block"}} />
  };
};

window.generateLevel = (x, y, seed) => {
  const rw = new RandomWalker(x, y, seed);
  //rw.walk();
  return rw;
}

window.showLevel = (grid, cursor, gridInfo = () => {return {}} ) => {
  //debugger;
  ReactDOM.render(
    <App grid={grid} cursor={cursor} gridInfo={gridInfo} /> ,
    document.getElementById('app')
  );
};

(function (gridStuff) {
  gridStuff.sumGrid = (grid) => {
    return grid.map( (line) => line.reduce( (a,b) => a+b ) ).reduce( (a,b) => a+b );
  }
})(window.gridStuff = window.gridStuff || {});

//showLevel( generateLevel(200, 100).grid );
//showLevel( [[]] );

window.stepped = 0;
window.maxSteps = 5000;
window.stepper = (level) => {
  if( window.stepped === window.maxSteps ) {
    window.stepped = 0;
    window.clearInterval(window.stepperInterval);
  } else {
    window.stepped++;
    level.step();
    if( window.stepped % 10 === 0 ) {
      const giValues = {};
      giValues.step = window.stepped;
      giValues.gridSize = JSON.stringify([level.grid[0].length, level.grid.length]);
      giValues.seed = level.seed;
      giValues.levelSize = gridStuff.sumGrid(level.grid);
      giValues.efficiency = (giValues.levelSize/window.stepped).toFixed(2);
      showLevel(level.grid, level.cursor, () => {return giValues} );
    }
  }
};

document.body.onkeyup = function(e){
    if(e.keyCode == 32){
        //showLevel( generateLevel(200, 100).grid );
        var level = generateLevel(100, 50);
        window.stepperInterval = window.setInterval(window.stepper.bind(null, level), 10);
    }
}

    </script>
  </body>
</html>
