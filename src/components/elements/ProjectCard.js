import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

function ProjectCard({ project }) {
  return (
    <div className="card mb-3 mx-auto">
      <div className="row g-0">
        <div className="col-md-8">
          <Link
            to={{
              pathname: `/portfolio/${project.id}`,
              state: {
                projectData: project,
              },
            }}
          >
            <img src={project.titleImage} className="img-fluid rounded-start" alt="..." />
          </Link>
        </div>
        <div className="col-md-4">
          <div className="card-body">
            <h5 className="card-title">
              <Link
                to={{
                  pathname: `/portfolio/${project.id}`,
                  state: {
                    projectData: project,
                  },
                }}
              >
                {project.title}
              </Link>
            </h5>
            <p className="card-text">{project.description}</p>
            <p>
              <small className="text-muted">Tags </small>
              {project.tags.map((tag) => (
                <span key={tag.id} className="badge bg-light text-dark">
                  {tag.name}
                </span>
              ))}
            </p>
            <Link
              to={{
                pathname: `/portfolio/${project.id}`,
                state: {
                  projectData: project,
                },
              }}
              className="btn btn-primary"
            >
              Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

ProjectCard.propTypes = {
  project: PropTypes.exact({
    id: PropTypes.number,
    title: PropTypes.string,
    titleImage: PropTypes.string,
    description: PropTypes.string,
    liveSite: PropTypes.string,
    criteria: PropTypes.string,
    results: PropTypes.string,
    tags: PropTypes.arrayOf(
      PropTypes.exact({
        id: PropTypes.number,
        name: PropTypes.string,
      })
    ),
    createdAt: PropTypes.string,
    updatedAt: PropTypes.string,
  }).isRequired,
};

export default ProjectCard;
