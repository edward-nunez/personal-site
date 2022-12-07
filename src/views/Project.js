import React from 'react';
import { useLocation } from 'react-router-dom';

export default function Project() {
  const location = useLocation();
  const { projectData } = location.state;

  return (
    <div className="container content">
      <article className="row" style={{ margin: '20px 0px' }}>
        <div className="col-12">
          <h2>{projectData.title}</h2>
        </div>
        <div className="col-12">
          <a href={projectData.liveSite}>
            <img src={projectData.titleImage} className="img-fluid rounded-start" alt="..." />
          </a>
        </div>
        <div className="col-10">
          <h3 className="text-muted">{projectData.description}</h3>
        </div>
        <div className="col-2">
          <a href={projectData.liveSite} className="btn btn-primary position-relative">
            Live Site{' '}
            <span
              className="position-absolute top-0 start-100 translate-middle badge 
            rounded-pill bg-danger"
            >
              {' '}
              !
            </span>
          </a>
        </div>
        <div className="col-12">
          <p>
            <small className="text-muted">Tags </small>
            {projectData.tags.map((tag) => (
              <span key={tag.id} className="badge bg-light text-dark">
                {tag.name}
              </span>
            ))}
          </p>
        </div>
        <div className="col-12">
          <h2 className="text-muted">Criteria</h2>
          <p>{projectData.criteria}</p>
        </div>
        <div className="col-12">
          <h2 className="text-muted">Results</h2>
          <p>{projectData.results}</p>
        </div>
      </article>
    </div>
  );
}
