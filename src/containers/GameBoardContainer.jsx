import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import DungeonContainer from './DungeonContainer';
import GameBoardView from '../views/GameBoardView';

class GameBoardContainer extends PureComponent {

  /* render */

  render() {
    return (
      <GameBoardView>
        <DungeonContainer />
      </GameBoardView>
    );
  }
}

export default connect()(GameBoardContainer);
