import React from 'react';
import { shallow } from 'enzyme';

import Work from './Work';

it('renders header', () => {
  const wrapper = shallow(<Work />);

  expect(wrapper.find('h1').length).toBe(1);
});
