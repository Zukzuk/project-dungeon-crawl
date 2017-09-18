import React from 'react';
import { Route, Link } from 'react-router-dom';

import Home from '../views/HomeView';
import GameContainer from './GameContainer';

export default () => (
  <div>
    <header>
      <Link to="/">Home</Link>
      <Link to="game">Game</Link>
    </header>

    <main>
      <Route exact path="/" component={Home} />
      <Route exact path="/game" component={GameContainer} />
    </main>
  </div>
);
