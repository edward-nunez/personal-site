import React from "react";
import useAxios from "axios-hooks";

import ProjectCard from "../components/elements/ProjectCard";

export default function Portfolio() {
  const [{ data, loading, error }, refetch] = useAxios(
    "http://localhost:3001/api/projects"
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        {data.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
}
