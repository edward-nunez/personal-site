import React from 'react';
import { shallow } from 'enzyme';

import Blog from './Blog';

it('renders header', () => {
  const wrapper = shallow(<Blog />);

  expect(wrapper.find('h1').length).toBe(1);
});
