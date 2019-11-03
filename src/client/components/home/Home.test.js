import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

it('renders header', () => {
  const home = shallow(<Home />);

  expect(home.find('h1').length).toBe(1);
});
