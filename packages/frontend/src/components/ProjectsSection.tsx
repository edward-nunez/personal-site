import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { projects } from "@/data/projects";

const ProjectsSection = () => {
  return (
    <section id="projects" className="py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
            // Chapter 06
          </p>
          <h2 className="text-5xl md:text-6xl font-bold mb-12">
            BUILD<span className="text-accent">_</span>LOG
          </h2>
        </motion.div>

        <div className="space-y-6">
          {projects.slice(0, 4).map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link
                to={`/project/${project.slug}`}
                className="block manga-panel bg-card group hover:manga-shadow transition-all duration-200 
                  hover:-translate-x-[3px] hover:-translate-y-[3px]"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Cover image */}
                  <div className="h-48 md:h-auto md:w-56 overflow-hidden border-b md:border-b-0 md:border-r-[3px] border-foreground shrink-0">
                    {project.coverImage ? (
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary halftone flex items-center justify-center">
                        <span className="font-mono text-xs text-muted-foreground">NO COVER</span>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="space-y-2">
                        <p className="font-mono text-xs text-muted-foreground">{project.chapter}</p>
                        <h3 className="text-2xl font-bold text-card-foreground group-hover:text-accent transition-colors">{project.title}</h3>
                        <p className="text-muted-foreground max-w-lg">{project.description}</p>
                      </div>
                      <div className="flex items-center gap-3 self-start">
                        <span className={`font-mono text-xs px-3 py-1 manga-panel whitespace-nowrap
                          ${project.status === "ONGOING" 
                            ? "bg-accent text-accent-foreground border-accent" 
                            : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {project.status}
                        </span>
                        <span className="font-mono text-xs text-accent font-bold group-hover:translate-x-1 transition-transform">
                          DETAILS →
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="font-mono text-xs px-2 py-1 bg-secondary text-secondary-foreground border border-border"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-center mt-10">
          <Link
            to="/archive"
            className="manga-panel bg-card px-8 py-3 font-mono text-sm font-bold tracking-widest
              hover:manga-shadow hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-200
              text-card-foreground hover:text-accent"
          >
            VIEW FULL BUILD LOG →
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
