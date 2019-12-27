import React from 'react';

export default function BlogPost() {
  return (
    <div className="col-12">
      <div className="w-100 card" style={{ border: '0px' }}>
        <div className="card-body">
          <h5 className="card-title">
            <a href="#" className="card-link">
              Blog Title
            </a>
          </h5>
          <h6 className="card-subtitle mb-2 text-muted">December 27, 2019</h6>
          <p className="card-text">
            Some quick example text to build on the card title and make up the
            bulk of the card&apos;s content. Some quick example text to build on
            the card title and make up the bulk of the card&apos;s content. Some
            quick example text to build on the card title and make up the bulk
            of the card&apos;s content.
          </p>
          <a href="#" className="card-link">
            Read More
          </a>
        </div>
      </div>
    </div>
  );
}
