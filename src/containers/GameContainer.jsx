import React, { PureComponent } from 'react';
import GameView from '../views/GameView';
import GameBoardContainer from './GameBoardContainer';
import GameMenuContainer from './GameMenuContainer';
import {Layer, Rect, Stage, Group} from 'react-konva';
//Rect, Circle, Ellipse, Line, Image, Text, TextPath, Star, Label, SVG Path, RegularPolygon
//https://konvajs.github.io/docs/overview.html

class GameContainer extends PureComponent {

  state = { color: 'green' };

  handleClick = () => {
    // window.Konva is a global variable for Konva framework namespace
    this.setState({
      color: window.Konva.Util.getRandomColor()
    });
  };

  /* render */

  render() {
    return (
      <GameView>
        <GameMenuContainer />
        <GameBoardContainer />
        <Stage width={700} height={700}>
          <Layer>
            <Rect
              x={640}
              y={10}
              width={50}
              height={50}
              fill={this.state.color}
              shadowBlur={5}
              onClick={this.handleClick}
            />
          </Layer>
        </Stage>
      </GameView>
    );
  }
}

export default GameContainer;
