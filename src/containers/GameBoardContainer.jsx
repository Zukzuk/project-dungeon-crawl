import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import EntityContainer from './EntityContainer';
import GameBoardView from '../views/GameBoardView';
import PlayerView from '../views/PlayerView';
import MinionView from '../views/MinionView';
import TileView from '../views/TileView';

import EntityActions from '../redux/actions/EntityActions';
import TileActions from '../redux/actions/TileActions';

import { dom, redux } from '../helpers/helpers';

class GameBoardContainer extends PureComponent {

  /* lifecycle */

  componentDidMount = () => {
    dom.optimizedResize();
    this.updateGameBoard({ ...this.props.state.GameBoard });
  };

  componentWillReceiveProps = nextProps => {
    this.updateGameBoard({ ...nextProps.state.GameBoard });
  };

  /* tile */

  getTileGrid = () => {
    const props = {
      state: {
        ...this.props.state.GameBoard,
        ...this.props.state.Tile
      },
      actions: this.props.actions.Tile
    };
    const { columns, rows } = this.props.state.GameBoard;
    // create grid
    let y = 0, grid = [];
    while (y++ < rows) {
      let x = 0, row = [];
      while (x++ < columns) {
        let index = x + ((y-1)*columns);
        row.push(this.getTile(props, index));
      }
      grid.push(row);
    }
    return grid;
  };

  getTile = (props, index) => {
    const selectTile = () => props.actions.selectTile(index - 1);
    return (
      <EntityContainer key={index}>
        <TileView {...props} onClick={ selectTile }/>
      </EntityContainer>
    )
  };

  /* player */

  getPlayers = () => {
    const props = {
      state: {
        ...this.props.state.Entity,
        ...this.props.state.GameBoard
      },
      actions: this.props.actions.Entity
    };
    return this.props.state.Entity.Player.spawns.reduce((result, spawn, index) => {
      props.id = index;
      result.push(this.getPlayer(props, index));
      return result;
    }, []);
  };

  getPlayer = (props, index) => (
    <EntityContainer key={index}>
      <PlayerView {...props} />
    </EntityContainer>
  );

  /* minions */

  getMinions = () => {
    const props = {
      state: {
        ...this.props.state.Entity,
        ...this.props.state.GameBoard
      },
      actions: this.props.actions.Entity
    };
    return this.props.state.Entity.Minion.spawns.reduce((result, spawn, index) => {
      props.id = index;
      result.push(this.getMinion(props, index));
      return result;
    }, []);
  };

  getMinion = (props, index) => (
    <EntityContainer key={index}>
      <MinionView {...props} />
    </EntityContainer>
  );

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
      { this.getTileGrid() }
      { this.getPlayers() }
      { this.getMinions() }
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
