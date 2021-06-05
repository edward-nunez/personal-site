import React from 'react';
import { shallow } from 'enzyme';

import About from './About';

it('renders header', () => {
  const wrapper = shallow(<About />);

  expect(wrapper.find('h1').length).toBe(1);
});
