import React from 'react';
import { render } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import * as serviceWorker from './serviceWorker';
import configureStore, { history } from './store/configureStore';
import Root from './components/Root';
import 'Styles/index.scss';

//
import './favicon.ico';
import './manifest.json';

const store = configureStore();

render(
  <AppContainer>
    <Root store={store} history={history} />
  </AppContainer>,
  document.getElementById('root')
);

if (module.hot) {
  module.hot.accept('./components/Root', () => {
    const NewRoot = require('./components/Root').default;

    render(
      <AppContainer>
        <NewRoot store={store} history={history} />
      </AppContainer>,
      document.getElementById('root')
    );
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
