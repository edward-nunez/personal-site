import React from 'react';

import Blog from '../components/sections/Blog';

export default function Home() {
  return (
    <div className="row">
      <Blog />
      <div className="col-md-3 mx-auto">side bar</div>
    </div>
  );
}
