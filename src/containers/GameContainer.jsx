import React, { PureComponent } from 'react';
import GameView from '../views/GameView';
import GameBoardContainer from './GameBoardContainer';
import GameMenuContainer from '../containers/GameMenuContainer';

class GameContainer extends PureComponent {

  render = () => (
    <GameView>
      <GameMenuContainer />
      <GameBoardContainer />
    </GameView>
  );
}

export default GameContainer;
