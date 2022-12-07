import React from 'react';
import { Link } from 'react-router-dom';

import { ProjectType } from '../../utils/types';

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
            <img src={project.showcaseImage} className="img-fluid rounded-start" alt="..." />
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
  project: ProjectType.isRequired,
};

export default ProjectCard;
