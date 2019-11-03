import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { AppContainer } from 'react-hot-loader';

import configureStore, { history } from './store/configureStore';
import Root from './components/Root';

const store = configureStore();

it('renders without crashing', () => {
  render(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>,
    document.createElement('root')
  );
  unmountComponentAtNode(document.createElement('root'));
});
