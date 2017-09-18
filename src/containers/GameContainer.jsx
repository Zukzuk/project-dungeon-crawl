import React, { PureComponent } from 'react';
import GameView from '../views/GameView';
import GameBoardContainer from './GameBoardContainer';
import GameMenuContainer from './GameMenuContainer';

class GameContainer extends PureComponent {

  render() {
    return (
      <GameView>
        <GameMenuContainer />
        <GameBoardContainer />
      </GameView>
    );
  }
}

export default GameContainer;
