import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { redux } from '../helpers/helpers';
import EntityActions from '../redux/actions/EntityActions';
import TileActions from '../redux/actions/TileActions';
import DungeonEntity from '../entities/DungeonEntity';
import PlayerEntity from '../entities/PlayerEntity';
import MinionEntity from '../entities/MinionEntity';
import GameBoardView from '../views/GameBoardView';

class GameBoardContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    this.dungeon = DungeonEntity.create(props, [
      PlayerEntity.create(props),
      MinionEntity.create(props)
    ]);
  };

  /* render */

  render = () => <GameBoardView>{ this.dungeon }</GameBoardView>;
}

export default connect(
  state => redux.mapState(state, [
    'Event',
    'GameBoard',
    'Tile',
    'Entity'
  ]),
  dispatch => redux.mapActions(dispatch, {
    Tile: TileActions,
    Entity: EntityActions
  })
)(GameBoardContainer);
