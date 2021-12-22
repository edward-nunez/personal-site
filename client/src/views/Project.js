import React from "react";

import projectsData from "../utils/projectsData.json";

export default function Project(props) {

  return (
    <div className="container content">
      <article className="row" style={{ margin: "20px 0px" }}>
        <div className="col-12">
          <h2>{projectsData[0].title}</h2>
        </div>
        <div className="col-12">
          <a href={projectsData[0].liveSite}><img src={projectsData[0].titleImage} 
          className="img-fluid rounded-start" alt="..."/></a>
        </div>
        <div className="col-10">
          <h3 className="text-muted">{projectsData[0].description}</h3>
        </div>
        <div className="col-2">
          <a href={projectsData[0].liveSite} className="btn btn-primary position-relative">
            Live Site <span className="position-absolute top-0 start-100 translate-middle badge 
            rounded-pill bg-danger"> !
            </span>
          </a>
        </div>
        <div className="col-12">
          <p><small className="text-muted">Tags </small>{projectsData[0].tags.map((tag, index) => (
            <span key={index} className="badge bg-light text-dark">{tag}</span>)
          )}
          </p>
        </div>
        <div className="col-12">
          <h2 className="text-muted">Criteria</h2>
          <p>{projectsData[0].criteria}</p>
        </div>
        <div className="col-12">
          <h2 className="text-muted">Results</h2>
          <p>{projectsData[0].results}</p>
        </div>
      </article>
    </div>
  );
}
