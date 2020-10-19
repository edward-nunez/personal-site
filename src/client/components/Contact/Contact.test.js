import React from 'react';
import { shallow } from 'enzyme';

import Contact from './Contact';

it('renders header', () => {
  const wrapper = shallow(<Contact />);

  expect(wrapper.find('h1').length).toBe(1);
});
