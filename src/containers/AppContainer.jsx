import React from 'react';
import { Route, Link } from 'react-router-dom';

import AppView from '../views/AppView';
import Home from '../views/HomeView';
import GameContainer from './GameContainer';
import LevelGeneratorContainer from './LevelGeneratorContainer';

export default () => (
  <div>
    <header>
      <Link to="/" className="btn btn-primary">Home</Link>
      <Link to="game" className="btn btn-primary">Game</Link>
      <Link to="level-generator" className="btn btn-primary">Level generator</Link>
    </header>

    <AppView>
      <Route exact path="/" component={Home} />
      <Route exact path="/game" component={GameContainer} />
      <Route exact path="/level-generator" component={LevelGeneratorContainer} />
    </AppView>
  </div>
);
