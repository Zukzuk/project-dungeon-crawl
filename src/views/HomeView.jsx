import React from 'react';
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const HomeView = props => (
  <div>
    <h1>Home</h1>
    <p>Welcome home!</p>
    <button onClick={() => props.gotoGame()}>Go to the game</button>
  </div>
);

const mapDispatchToProps = dispatch => bindActionCreators({
  gotoGame: () => push('/game') //react-router-redux implementation
}, dispatch);

export default connect(null, mapDispatchToProps)(HomeView);