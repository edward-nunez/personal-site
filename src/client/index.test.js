import React from 'react';
import { shallow } from 'enzyme';
import { AppContainer } from 'react-hot-loader';

import configureStore, { history } from './store/configureStore';
import Root from './components/Root';
import 'Styles/index.scss';
import './favicon.ico';

it('renders without crashing', () => {
  const store = configureStore();

  const wrapper = shallow(
    <AppContainer>
      <Root store={store} history={history} />
    </AppContainer>
  );

  expect(wrapper.children.length).toBe(1);
});
