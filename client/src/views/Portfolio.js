import React, { useState, useEffect, useCallback } from 'react';

import ProjectCard from '../components/elements/ProjectCard';

export default function Portfolio() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async (signal) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:5000/api/v1/projects', { signal });
      if (!res.ok) throw new Error(`Network response was not ok (${res.status})`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      if (err.name !== 'AbortError') setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchProjects(controller.signal);
    return () => controller.abort();
  }, [fetchProjects]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error!</p>;

  return (
    <div className="row">
      <div className="col-md-12 mx-auto">
        {data && data.map((project) => <ProjectCard key={project.id} project={project} />)}
      </div>
    </div>
  );
}
