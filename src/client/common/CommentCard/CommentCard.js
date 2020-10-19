import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faHeartBroken } from '@fortawesome/free-solid-svg-icons';

function timeSince(date) {
  let seconds = Math.floor((new Date() - Date.parse(date)) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) {
    return Math.floor(interval) + ' years';
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return Math.floor(interval) + ' months';
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return Math.floor(interval) + ' days';
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return Math.floor(interval) + ' hours';
  }
  interval = seconds / 60;
  if (interval > 1) {
    return Math.floor(interval) + ' minutes';
  }
  return Math.floor(seconds) + ' seconds';
}

export default function CommentCard(props) {
  return (
    <div className="col-12">
      <div className="w-100 card" style={{ border: '0px' }}>
        <div className="card-body">
          <div className="card-title">
            {props.data.author}{' '}
            <small>{timeSince(props.data.createdAt)} ago</small>
          </div>
          <div className="card-text" style={{ marginBottom: '12px' }}>
            {props.data.comment}
          </div>
          <div className="card-text">
            <FontAwesomeIcon icon={faHeart} className="social-icon" />{' '}
            {props.data.upVotes}{' '}
            <FontAwesomeIcon icon={faHeartBroken} className="social-icon" />{' '}
            {props.data.downVotes}{' '}
            <button
              type="button"
              className="btn btn-outline-dark"
              style={{ border: 'none' }}
            >
              REPLY
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
