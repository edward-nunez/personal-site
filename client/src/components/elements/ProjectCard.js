import React from "react";
import { Link } from "react-router-dom";

export default function ProjectCard(props) {
  let project = props.project;

  return (
    <div className="card mb-3 mx-auto">
      <div className="row g-0">
        <div className="col-md-8">
          <Link to={`/portfolio/${project.id}`}>
            <img
              src={project.titleImage}
              className="img-fluid rounded-start"
              alt="..."
            />
          </Link>
        </div>
        <div className="col-md-4">
          <div className="card-body">
            <h5 className="card-title">
              <Link to={`/portfolio/${project.id}`}>{props.project.title}</Link>
            </h5>
            <p className="card-text">{project.description}</p>
            <p>
              <small className="text-muted">Tags </small>
              {project.tags.map((tag, index) => (
                <span key={index} className="badge bg-light text-dark">
                  {tag}
                </span>
              ))}
            </p>
            <Link to={`/portfolio/${project.id}`} className="btn btn-primary">
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
