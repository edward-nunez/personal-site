import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";

import timeSince from '../../utils/timeSince';

export default function BlogCard(props) {
  return (
    <article className="card mb-4" style={{ border: "0px" }}>
      <Link to={`/blog/${props.post.id}`}>
        <img
          className="center-crop"
          src={props.post.titleImage}
          style={{ padding: "0px 20px 0px 20px" }}
          alt=""
        />
      </Link>
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/blog/${props.post.id}`} className="card-link">
            {props.post.title}
          </Link>
        </h5>
        <div className="card-subtitle mb-2">{props.post.subTitle}</div>
        <div className="card-meta text-muted">
          {moment(props.post.createdAt).format("MMM DD, YYYY")} Last updated{" "}
          {timeSince(props.post.updatedAt)} ago
        </div>
      </div>
    </article>
  );
}
