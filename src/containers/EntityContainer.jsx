import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { redux, dom } from '../helpers/helpers';

import DungeonEntity from './DungeonContainer';
import RoomEntity from '../entities/RoomEntity';
import MinionEntity from '../entities/MinionEntity';

class EntityContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    this.child = dom.toArray(props.children)[0];
    this.type = this.child.type.name.replace('View', '');
    this.childProps = this.child.props;
    this.api = {
      ...{
        DungeonEntity,
        RoomEntity,
        MinionEntity
      }[this.type + 'Entity']
    };
    if (this.api.init) this.api.init(this, this.childProps);
  };

  componentDidMount = () => {
    if (this.api.mount) this.api.mount(this, this.childProps);
  };

  componentWillReceiveProps = nextProps => {
    this.child = dom.toArray(nextProps.children)[0];
    this.childProps = this.child.props;
    if (this.api.update) this.api.update(this, this.childProps, nextProps.state.Event);
  };

  /* render */

  render = () => this.child;
}

export default connect(
  state => redux.mapState(
    state, ['Event']
  )
)(EntityContainer);
