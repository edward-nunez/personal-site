import React from 'react';

import '../App.style.scss';

export default function BlogCard(props) {
  return (
    <div className="container content">
      <h1>Blog Post {props.match.params.id}</h1>
    </div>
  );
}
