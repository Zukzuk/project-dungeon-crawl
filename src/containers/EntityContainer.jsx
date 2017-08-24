import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import PlayerEntity from '../entities/PlayerEntity';
import MinionEntity from '../entities/MinionEntity';
import TileEntity from '../entities/TileEntity';

class EntityContainer extends PureComponent {

  constructor(props) {
    super(props);
    this.componentConstruct(props);
  }

  /* lifecycle */

  componentConstruct = props => {
    this.type = props.children.type.name.replace('View', '');
    const entities = {TileEntity, PlayerEntity, MinionEntity};
    this.api = { ...entities[this.type + 'Entity'] };

    if (this.type === 'Player') this.api.resize(this, this.props.children.props);
    if (this.type === 'Minion') this.api.resize(this, this.props.children.props);
    if (this.api.init) this.api.init(this, this.props.children.props);
  };

  componentDidMount = () => {
    if (this.api.mount) this.api.mount(this, this.props.children.props);
  };

  componentWillReceiveProps = nextProps => {
    //if (this.type === 'PlayerView') debugger;
    if (this.api.update) this.api.update(this, _.get(nextProps, 'children.props'));
  };

  /* render */

  render = () => this.props.children;
}

export default connect()(EntityContainer);
