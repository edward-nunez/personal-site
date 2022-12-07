import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import PropTypes from 'prop-types';

import timeSince from '../../utils/timeSince';

function BlogCard({ post }) {
  return (
    <article className="card mb-4" style={{ border: '0px' }}>
      <Link to={`/blog/${post.id}`}>
        <img className="center-crop" src={post.titleImage} style={{ padding: '0px 20px 0px 20px' }} alt="" />
      </Link>
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/blog/${post.id}`} className="card-link">
            {post.title}
          </Link>
        </h5>
        <div className="card-subtitle mb-2">{post.subTitle}</div>
        <div className="card-meta text-muted">
          {moment(post.createdAt).format('MMM DD, YYYY')} Last updated {timeSince(post.updatedAt)} ago
        </div>
      </div>
    </article>
  );
}

BlogCard.propTypes = {
  post: PropTypes.exact({
    id: PropTypes.number,
    title: PropTypes.string,
    titleImage: PropTypes.string,
    subTitle: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
};

export default BlogCard;
