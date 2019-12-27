import React from 'react';

import BlogPost from './BlogPost';

export default function Blog() {
  return (
    <div className="container">
      <div className="row">
        <BlogPost />
        <BlogPost />
        <BlogPost />
        <BlogPost />
      </div>
    </div>
  );
}
