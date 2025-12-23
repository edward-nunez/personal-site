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
    id: PropTypes.string,
    author: PropTypes.exact({
      name: PropTypes.string,
      email: PropTypes.string,
    }),
    title: PropTypes.string,
    titleImage: PropTypes.string,
    subTitle: PropTypes.string,
    body: PropTypes.string,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
    upVotes: PropTypes.number,
    downVotes: PropTypes.number,
    tags: PropTypes.arrayOf(PropTypes.string),
    comments: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.string,
        author: PropTypes.string,
        createdAt: PropTypes.string,
        updatedAt: PropTypes.string,
        comment: PropTypes.string,
        upVotes: PropTypes.number,
        downVotes: PropTypes.number,
        replies: PropTypes.arrayOf(
          PropTypes.exact({
            id: PropTypes.string,
            author: PropTypes.string,
            createdAt: PropTypes.string,
            updatedAt: PropTypes.string,
            comment: PropTypes.string,
            upVotes: PropTypes.number,
            downVotes: PropTypes.number,
          })
        ),
      })
    ),
  }).isRequired,
};

export default BlogCard;
