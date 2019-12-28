import React from 'react';
import { Link } from 'react-router-dom';

import './BlogCard.style.scss';

export default function BlogCard() {
  return (
    <div className="col-12">
      <div className="w-100 card" style={{ border: '0px' }}>
        <div className="card-body">
          <div
            className="card-subtitle mb-2 text-muted"
            style={{ fontSize: '14px' }}
          >
            December 27, 2019
          </div>
          <h5 className="card-title">
            <Link to="/blog/12345" className="card-link">
              Blog Title
            </Link>
          </h5>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card&apos;s content. Some quick example text to build on
            the card title and make up the bulk of the card&apos;s content. Some
            quick example text to build on the card title and make up the bulk
            of the card&apos;s content.
          </p>
          <div className="tags">
            <a href="#" className="tag">
              #JavaScript
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
