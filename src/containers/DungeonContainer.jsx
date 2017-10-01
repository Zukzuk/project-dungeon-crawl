import React, {PureComponent} from 'react';
import {connect} from 'react-redux';
import {_react_, _redux_} from '../helpers/helpers';
import _dungeon_ from '../helpers/dungeon';

import DungeonView from '../views/DungeonView';
import RoomContainer from '../containers/RoomContainer';
import RoomView from '../views/RoomView';
import TileContainer from '../containers/TileContainer';
import TileView from '../views/TileView';
import CameraContainer from "./CameraContainer";
import PlayerContainer from "./PlayerContainer";

class DungeonContainer extends PureComponent {

  /* lifecycle */

  state = {
    dungeonInstance: null
  };

  componentDidMount() {
    this.props.actions.GameMenu.updateLevel(8);
  }

  componentWillReceiveProps(nextProps) {
    const _update_ = {props: this.props, contextName: this.constructor.name};
    this.updateDungeon({...nextProps, ...{ ..._update_, methodName: this.updateDungeon.name }});
    this.updateRoomVisibility({...nextProps, ...{ ..._update_, methodName: this.updateRoomVisibility.name }});
  }

  updateDungeon(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'GameBoard.level')) {
      this.calculateNewDungeon(nextProps);
    }
  }

  updateRoomVisibility(nextProps) {
    if (_react_.stateDidUpdate(nextProps, 'Entity.Player.spawns[0].position.roomId')) {
      if (!isNaN(nextProps.state.Entity.Player.spawns[0].position.roomId)) this.setDungeon(nextProps);
    }
  }

  /* methods */

  calculateNewDungeon(props) {
    const {tileGrids, roomGrids} = _dungeon_.build(props.state.GameBoard.level, props.state.Tile.size);
    this.tileGrids = tileGrids;
    this.roomGrids = roomGrids;

    this.setDungeon(props);
  }

  getDungeonInstance(props) {
    const grids = this.tileGrids.reduce((result, grid) => {
      result.push(grid.map(tiles => tiles.map((tileProps, index) => {
        tileProps.onClick = () => props.actions.Tile.selectTile(tileProps.id, tileProps.roomId);
        // const tileGutter = props.state.Tile.gutter;
        const tileWidth = (1/tileProps.columns) ;
        tileProps.style = {
          //margin: `${tileGutter}px`,
          //width: `calc(100% * ${tileWidth} - ${tileGutter * 2}px)`,
          width: `calc(100% * ${tileWidth})`,
          backgroundSize: `900%`,
          backgroundPosition: `calc(900%*${Math.ceil(Math.random()*9)/9}) calc(900%*${Math.ceil(Math.random()*9)/9})`
        };
        return (
          <TileContainer key={index}>
            <TileView {...tileProps}></TileView>
          </TileContainer>
        );
      })));
      return result;
    }, []);

    const instance = this.roomGrids.reduce((result, roomProps, index) => {
      const tiles = grids[index];
      result.push(
        <RoomContainer key={index}>
          <RoomView {...roomProps}>{tiles}</RoomView>
        </RoomContainer>
      );
      return result;
    }, []);

    return <div id='rooms'>{ instance }</div>;
  }

  /* local state */

  getDungeonProps(props) {
    return {
      state: props.state.GameBoard
    };
  }

  setDungeon(props) {
    this.setState({
      ...this.state,
      dungeonInstance: this.getDungeonInstance(props)
    });
  }

  /* render */

  render() {
    return (
      <DungeonView {...this.getDungeonProps(this.props)}>
        <CameraContainer>
          {this.state.dungeonInstance}
          <PlayerContainer/>
          {/*<MinionContainer />*/}
        </CameraContainer>
      </DungeonView>
    );
  }
}

export default connect(
  state => _redux_.mapState(state, [
    'GameBoard', 'Tile', 'Entity'
  ]),
  dispatch => _redux_.mapActions(dispatch, [
    'GameMenu', 'Tile'
  ])
)(DungeonContainer);
