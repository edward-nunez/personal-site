import React from 'react';
import { shallow } from 'enzyme';

import Projects from './Projects';

it('renders header', () => {
  const wrapper = shallow(<Projects />);

  expect(wrapper.find('h1').length).toBe(1);
});
