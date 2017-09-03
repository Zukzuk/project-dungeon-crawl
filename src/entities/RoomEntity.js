import React from 'react';
import RoomView from '../views/RoomView';
import EntityContainer from '../containers/EntityContainer';

export default {
  create: (props, grid, index) => {
    props.id = index;
    return (
      <EntityContainer key={ index }>
        <RoomView { ...props }>{ grid }</RoomView>
      </EntityContainer>
    );
  }
};
