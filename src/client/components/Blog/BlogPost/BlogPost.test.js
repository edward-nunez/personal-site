import React from 'react';
import { shallow } from 'enzyme';

import BlogPost from './BlogPost';

it('renders header', () => {
  const wrapper = shallow(<BlogPost />);

  expect(wrapper.find('h1').length).toBe(1);
});
