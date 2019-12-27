import React from './node_modules/react';
import { shallow } from './node_modules/enzyme';

import Home from './Home';

it('renders header', () => {
  const wrapper = shallow(<Home />);

  expect(wrapper.find('h1').length).toBe(1);
});
