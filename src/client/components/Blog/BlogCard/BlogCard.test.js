import React from 'react';
import { shallow } from 'enzyme';

import BlogCard from './BlogCard';

it('renders header', () => {
  const wrapper = shallow(<BlogCard />);

  expect(wrapper.find('h1').length).toBe(1);
});
