import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import store, { history } from './store';

import _ from 'lodash';
window.dotProp = require('dot-prop-immutable');

import AppContainer from './containers/AppContainer';

const target = document.querySelector('#app');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
        <AppContainer />
    </ConnectedRouter>
  </Provider>,
  target
);
