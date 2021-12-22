import React from "react";

import ProjectCard from "../elements/ProjectCard";
import projectsData from "../../utils/projectsData.json";

export default function Projects() {
  
  return (
    <div className="col-md-12">
      {projectsData.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  )
};