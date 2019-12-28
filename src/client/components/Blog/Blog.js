import React from 'react';

import BlogCard from '../../common/BlogCard/BlogCard';

import '../App.style.scss';

export default function Blog() {
  return (
    <div className="container content">
      <div className="row">
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <BlogCard />
        <nav
          className="col-12"
          style={{ marginLeft: '20px' }}
          aria-label="Page navigation example"
        >
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#">
                Previous
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Next
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
