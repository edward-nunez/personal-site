import React from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

import './BlogCard.style.scss';

export default function BlogCard(props) {
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

  return (
    <div className="col-12">
      <div className="w-100 card" style={{ border: '0px' }}>
        <Link to={`/blog/${props.post.id}`}>
          <img
            className="center-crop"
            src={props.post.titleImage}
            style={{ padding: '0px 20px 0px 20px' }}
            alt="Card image cap"
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title">
            <Link to={`/blog/${props.post.id}`} className="card-link">
              {props.post.title}
            </Link>
            <h6 className="card-text" style={{ opacity: '65%' }}>
              {props.post.subTitle}
            </h6>
          </h5>
          <div
            className="card-subtitle mb-2 text-muted"
            style={{ fontSize: '14px' }}
          >
            {moment(props.post.createdAt).format('MMM DD, YYYY')}{' '}
            <small className="text-muted">
              Last updated {timeSince(props.post.updatedAt)} ago
            </small>
          </div>
          <div className="tags">
            <small className="text-muted">
              Comments {props.post.comments.length}
            </small>
            {'  '}
            <small className="text-muted">Tags </small>
            {props.post.tags.map((tag, index) => (
              <a href="#" key={index} className="tag">
                #{tag}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
