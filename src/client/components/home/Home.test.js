import React from 'react';
import { shallow } from 'enzyme';

import Home from './Home';

it('renders header', () => {
  const wrapper = shallow(<Home />);

  expect(wrapper.find('h1').length).toBe(1);
});
