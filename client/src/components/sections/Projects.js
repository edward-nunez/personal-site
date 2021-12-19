import React from "react";

import ProjectCard from "../elements/ProjectCard";
import projectsData from "../../utils/projectsData.json";

export default function Projects() {
  
  return (
    <div className="col-md-9">
      {projectsData.map((project) => (
        <ProjectCard key={project.id} post={project} />
      ))}
    </div>
  )
};