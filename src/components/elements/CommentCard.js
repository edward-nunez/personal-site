import React from 'react';
import { HandThumbsUp, HandThumbsDown } from 'react-bootstrap-icons';
import PropTypes from 'prop-types';

function timeSince(date) {
  const seconds = Math.floor((new Date() - Date.parse(date)) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return `${Math.floor(interval)} years`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes`;
  }
  return `${Math.floor(seconds)} seconds`;
}

function CommentCard({ comment }) {
  return (
    <div className="col-12">
      <div className="w-100 card" style={{ border: '0px' }}>
        <div className="card-body">
          <div className="card-title">
            {comment.author} <small>{timeSince(comment.createdAt)} ago</small>
          </div>
          <div className="card-text" style={{ marginBottom: '12px' }}>
            {comment.body}
          </div>
          <div className="card-text">
            <HandThumbsUp className="social-icon" /> {comment.upVotes} <HandThumbsDown className="social-icon" />{' '}
            {comment.downVotes}{' '}
            <button type="button" className="btn btn-outline-dark" style={{ border: 'none' }}>
              REPLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

CommentCard.propTypes = {
  comment: PropTypes.exact({
    id: PropTypes.number,
    author: PropTypes.string,
    body: PropTypes.string,
    upVotes: PropTypes.number,
    downVotes: PropTypes.number,
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
};

export default CommentCard;
