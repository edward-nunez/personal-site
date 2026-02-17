import { useParams, Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { projectStatusDisplay } from '@/utils/formatters';
import { useProjectBySlug, useProjects } from '@/hooks/useProjects';

const ProjectDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();
  const { project, isLoading, isError, error } = useProjectBySlug(slug);
  const { projects } = useProjects();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const currentIndex = project ? projects.findIndex((p) => p.slug === project.slug) : -1;
  const prevProject = currentIndex > 0 ? (projects[currentIndex - 1] ?? null) : null;
  const nextProject =
    currentIndex >= 0 && currentIndex < projects.length - 1
      ? (projects[currentIndex + 1] ?? null)
      : null;

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen bg-background pt-16 flex items-center justify-center">
          <p className="font-mono text-muted-foreground">Loading...</p>
        </main>
      </>
    );
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-6 font-mono">
            {isError
              ? (error?.message ?? 'Failed to load project.')
              : 'Project not found in the build log.'}
          </p>
          <Link to="/#projects" className="font-mono text-sm text-accent hover:underline">
            ← BACK TO BASE
          </Link>
        </div>
      </div>
    );
  }

  const hasRoleOrDuration = project.role != null || project.duration != null;
  const hasHighlights = (project.highlights?.length ?? 0) > 0;

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background pt-16"
      >
        <div className="border-b-[3px] border-foreground">
          <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
            <Link
              to="/#projects"
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              ← BACK TO BUILD LOG
            </Link>
            {project.chapter && (
              <span className="font-mono text-xs text-muted-foreground">{project.chapter}</span>
            )}
          </div>
        </div>

        <div className="w-full h-64 md:h-80 overflow-hidden border-b-[3px] border-foreground">
          {(project.coverImage ?? project.images[0]) ? (
            <img
              src={project.coverImage ?? project.images[0]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-secondary halftone flex items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground">NO COVER IMAGE</span>
            </div>
          )}
        </div>

        <div className="container mx-auto px-6 lg:px-12 py-12 md:py-20">
          <div>
            <div className="flex items-center gap-4 mb-4 flex-wrap">
              <span
                className={`font-mono text-xs px-3 py-1 manga-panel whitespace-nowrap
                  ${
                    project.status === 'in-progress'
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
              >
                {projectStatusDisplay(project.status)}
              </span>
              {hasRoleOrDuration && (
                <>
                  {project.role && (
                    <span className="font-mono text-xs text-muted-foreground">{project.role}</span>
                  )}
                  {project.role && project.duration && (
                    <span className="font-mono text-xs text-muted-foreground">·</span>
                  )}
                  {project.duration && (
                    <span className="font-mono text-xs text-muted-foreground">
                      {project.duration}
                    </span>
                  )}
                </>
              )}
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{project.title}</h1>

            <p className="text-lg text-muted-foreground mb-8 max-w-2xl">{project.description}</p>

            <div className="flex flex-wrap gap-2 mb-8">
              {project.technologies.map((t) => (
                <span
                  key={t}
                  className="font-mono text-xs px-3 py-1 bg-secondary text-secondary-foreground border border-border"
                >
                  {t}
                </span>
              ))}
            </div>

            <div className="h-[5px] bg-foreground w-24 manga-shadow-sm" />
          </div>
        </div>

        {hasHighlights && (
          <div className="container mx-auto px-6 lg:px-12 pb-12">
            <div>
              <div className="manga-panel-thick bg-card">
                <div className="px-6 py-3 border-b-[3px] border-foreground halftone">
                  <span className="font-mono text-sm font-bold">KEY METRICS</span>
                </div>
                <div className="p-6 grid sm:grid-cols-2 gap-4">
                  {(project.highlights ?? []).map((h, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="font-mono text-accent font-bold text-sm mt-0.5">▸</span>
                      <span className="text-sm text-card-foreground">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="container mx-auto px-6 lg:px-12 pb-20">
          <article className="space-y-6">
            {(project.content ?? []).map((block, i) => {
              switch (block.type) {
                case 'heading':
                  return (
                    <h2 key={i} className="text-2xl md:text-3xl font-bold mt-12 mb-4 first:mt-0">
                      {block.text}
                    </h2>
                  );
                case 'paragraph':
                  return (
                    <p
                      key={i}
                      className="text-base md:text-lg leading-relaxed text-muted-foreground"
                    >
                      {block.text}
                    </p>
                  );
                case 'blockquote':
                  return (
                    <blockquote
                      key={i}
                      className="manga-panel border-l-[5px] border-accent pl-6 py-4 pr-4 bg-secondary/50 italic text-foreground font-medium"
                    >
                      {block.text}
                    </blockquote>
                  );
                case 'code':
                  return (
                    <div key={i} className="manga-panel-thick bg-card overflow-x-auto">
                      <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-foreground halftone">
                        <span className="font-mono text-xs font-bold">
                          {block.language || 'code'}
                        </span>
                      </div>
                      <pre className="p-4 text-xs md:text-sm leading-relaxed overflow-x-auto">
                        <code className="font-mono text-foreground">{block.text}</code>
                      </pre>
                    </div>
                  );
                default:
                  return null;
              }
            })}
          </article>

          <div className="mt-20 pt-8 border-t-[3px] border-foreground">
            <div className="flex items-center justify-between">
              {prevProject ? (
                <Link to={`/project/${prevProject.slug}`} className="group">
                  <span className="font-mono text-xs text-muted-foreground block mb-1">
                    ← PREV BUILD
                  </span>
                  <span className="font-bold text-sm group-hover:text-accent transition-colors">
                    {prevProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextProject ? (
                <Link to={`/project/${nextProject.slug}`} className="group text-right">
                  <span className="font-mono text-xs text-muted-foreground block mb-1">
                    NEXT BUILD →
                  </span>
                  <span className="font-bold text-sm group-hover:text-accent transition-colors">
                    {nextProject.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </div>
      </motion.main>
    </>
  );
};

export default ProjectDetail;
