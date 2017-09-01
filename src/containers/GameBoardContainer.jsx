import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import { dom, redux } from '../helpers/helpers';
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
    this.dungeon = DungeonEntity.create(props);
    this.players = PlayerEntity.create(props);
    this.minions = MinionEntity.create(props);
  };

  componentDidMount = () => {
    dom.optimizedResize();
    this.updateGameBoard({ ...this.props.state.GameBoard });
  };

  componentWillReceiveProps = nextProps => {
    this.updateGameBoard({ ...nextProps.state.GameBoard });
  };

  /* updates */

  updateGameBoard = ({hasPerspective}) => {
    dom.setClassList({
      node: ReactDOM.findDOMNode(this),
      names: 'perspective',
      addif: hasPerspective
    });
  };

  /* render */

  render = () => (
    <GameBoardView>
      { this.dungeon }
      { this.players }
      { this.minions }
    </GameBoardView>
  );
}

export default connect(
  state => redux.mapState(
    state, ['Entity', 'GameBoard', 'Tile']
  ),
  dispatch => redux.mapActions(
    dispatch, {Entity: EntityActions, Tile: TileActions}
  )
)(GameBoardContainer);
