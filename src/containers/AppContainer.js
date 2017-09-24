import React from 'react';
import { Route, Link } from 'react-router-dom';

import Home from '../views/HomeView';
import GameContainer from './GameContainer';
import LevelGeneratorContainer from './LevelGeneratorContainer';

export default () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      <Link to="game">Game</Link>
      <Link to="level-generator">Level generator</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/game" component={GameContainer} />
      <Route exact path="/level-generator" component={LevelGeneratorContainer} />
    </main>
  </div>
);
