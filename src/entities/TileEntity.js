import React from 'react';
import TileView from '../views/TileView';
import EntityContainer from '../containers/EntityContainer';

export default {
  create: (props, index) => {
    const selectTile = () => props.actions.selectTile(index - 1);
    props.id = index - 1;
    return (
      <EntityContainer key={ index }>
        <TileView { ...props } onClick={ selectTile }/>
      </EntityContainer>
    )
  }
};
