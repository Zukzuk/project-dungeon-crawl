import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { redux } from '../helpers/helpers';

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
    this.childProps = this.props.children.props;
    this.api = {
      ...{
        TileEntity,
        PlayerEntity,
        MinionEntity
      }[this.type + 'Entity']
    };

    if (this.api.init) this.api.init(this, this.childProps);
  };

  componentDidMount = () => {
    if (this.api.mount) this.api.mount(this, this.childProps);
  };

  componentWillReceiveProps = nextProps => {
    //if (this.type === 'Player') debugger;
    this.childProps = _.get(nextProps, 'children.props');
    if (this.api.update) this.api.update(this, this.childProps, nextProps.state.Event);
  };

  /* render */

  render = () => this.props.children;
}

export default connect(
  state => redux.mapState(
    state, ['Event']
  )
)(EntityContainer);
