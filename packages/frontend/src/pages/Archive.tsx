import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { blogPosts } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";

type Tab = "projects" | "blog";
const ITEMS_PER_PAGE = 4;

const Archive = () => {
  const location = useLocation();
  const initialTab = location.hash === "#blog" ? "blog" : "projects";
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [search, setSearch] = useState("");
  const [selectedTech, setSelectedTech] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [activeTab, search, selectedTech, selectedTag]);

  // All unique tech tags from projects
  const allTech = useMemo(
    () => [...new Set(projects.flatMap((p) => p.tech))].sort(),
    []
  );

  // All unique tags from blog posts
  const allBlogTags = useMemo(
    () => [...new Set(blogPosts.flatMap((p) => p.tags))].sort(),
    []
  );

  // Filtered projects
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());
      const matchesTech = !selectedTech || p.tech.includes(selectedTech);
      return matchesSearch && matchesTech;
    });
  }, [search, selectedTech]);

  // Filtered blog posts
  const filteredPosts = useMemo(() => {
    return blogPosts.filter((p) => {
      const matchesSearch =
        !search ||
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(search.toLowerCase());
      const matchesTag = !selectedTag || p.tags.includes(selectedTag);
      return matchesSearch && matchesTag;
    });
  }, [search, selectedTag]);

  const currentItems = activeTab === "projects" ? filteredProjects : filteredPosts;
  const totalPages = Math.max(1, Math.ceil(currentItems.length / ITEMS_PER_PAGE));
  const paginatedItems = currentItems.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  return (
    <>
      <Navbar />
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-background pt-16"
      >
        {/* Top bar */}
        <div className="border-b-[3px] border-foreground">
          <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
            <Link
              to="/"
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              ← BACK TO BASE
            </Link>
            <span className="font-mono text-xs text-muted-foreground">ARCHIVE</span>
          </div>
        </div>

        {/* Header */}
        <div className="container mx-auto px-6 lg:px-12 py-12 md:py-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-2">
            FULL<span className="text-accent">_</span>ARCHIVE
          </h1>
          <p className="font-mono text-sm text-muted-foreground">
            // Browse all builds and ride notes
          </p>
        </div>

        {/* Tabs + Filters */}
        <div className="container mx-auto px-6 lg:px-12 pb-20">
          {/* Tab switcher */}
          <div className="flex gap-0 mb-8">
            <button
              onClick={() => { setActiveTab("projects"); setSelectedTag(null); }}
              className={`font-mono text-sm px-6 py-3 border-[3px] border-foreground transition-colors
                ${activeTab === "projects"
                  ? "bg-foreground text-background font-bold"
                  : "bg-card text-card-foreground hover:bg-secondary"
                }`}
            >
              BUILDS ({filteredProjects.length})
            </button>
            <button
              onClick={() => { setActiveTab("blog"); setSelectedTech(null); }}
              className={`font-mono text-sm px-6 py-3 border-[3px] border-l-0 border-foreground transition-colors
                ${activeTab === "blog"
                  ? "bg-foreground text-background font-bold"
                  : "bg-card text-card-foreground hover:bg-secondary"
                }`}
            >
              NOTES ({filteredPosts.length})
            </button>
          </div>

          {/* Search + Filters row */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            {/* Search */}
            <div className="manga-panel bg-card flex-1">
              <input
                type="text"
                placeholder={activeTab === "projects" ? "Search builds..." : "Search notes..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent px-4 py-3 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Filter chips */}
            <div className="flex flex-wrap gap-2 items-center">
              <span className="font-mono text-xs text-muted-foreground mr-1">FILTER:</span>
              {activeTab === "projects" ? (
                <>
                  <button
                    onClick={() => setSelectedTech(null)}
                    className={`font-mono text-xs px-3 py-1.5 border border-border transition-colors
                      ${!selectedTech ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
                  >
                    ALL
                  </button>
                  {allTech.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTech(selectedTech === t ? null : t)}
                      className={`font-mono text-xs px-3 py-1.5 border border-border transition-colors
                        ${selectedTech === t ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
                    >
                      {t}
                    </button>
                  ))}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedTag(null)}
                    className={`font-mono text-xs px-3 py-1.5 border border-border transition-colors
                      ${!selectedTag ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
                  >
                    ALL
                  </button>
                  {allBlogTags.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedTag(selectedTag === t ? null : t)}
                      className={`font-mono text-xs px-3 py-1.5 border border-border transition-colors
                        ${selectedTag === t ? "bg-accent text-accent-foreground border-accent" : "bg-secondary text-secondary-foreground hover:bg-muted"}`}
                    >
                      {t}
                    </button>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Results */}
          <div className="space-y-4">
            {paginatedItems.length === 0 ? (
              <div className="manga-panel bg-card p-12 text-center">
                <p className="font-mono text-sm text-muted-foreground">No results found. Try a different search or filter.</p>
              </div>
            ) : activeTab === "projects" ? (
              (paginatedItems as typeof projects).map((project, i) => (
                <motion.div
                  key={project.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={`/project/${project.slug}`}
                    className="block manga-panel bg-card group hover:manga-shadow transition-all duration-200
                      hover:-translate-x-[3px] hover:-translate-y-[3px]"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Cover thumbnail */}
                      <div className="h-36 md:h-auto md:w-40 overflow-hidden border-b md:border-b-0 md:border-r-[3px] border-foreground shrink-0">
                        {project.coverImage ? (
                          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-secondary halftone flex items-center justify-center min-h-[9rem]">
                            <span className="font-mono text-xs text-muted-foreground">NO COVER</span>
                          </div>
                        )}
                      </div>
                      <div className="halftone p-4 md:p-6 md:w-20 flex items-center justify-center border-b md:border-b-0 md:border-r-[3px] border-foreground">
                        <span className="font-mono text-lg font-bold">{project.chapter}</span>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                          <div className="space-y-1">
                            <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors">
                              {project.title}
                            </h3>
                            <p className="text-muted-foreground text-sm max-w-lg">{project.description}</p>
                          </div>
                          <div className="flex items-center gap-3 self-start shrink-0">
                            <span className={`font-mono text-xs px-3 py-1 manga-panel whitespace-nowrap
                              ${project.status === "ONGOING"
                                ? "bg-accent text-accent-foreground border-accent"
                                : "bg-secondary text-secondary-foreground"}`}
                            >
                              {project.status}
                            </span>
                            <span className="font-mono text-xs text-accent font-bold group-hover:translate-x-1 transition-transform">
                              →
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {project.tech.map((t) => (
                            <span key={t} className="font-mono text-xs px-2 py-0.5 bg-secondary text-secondary-foreground border border-border">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            ) : (
              (paginatedItems as typeof blogPosts).map((post, i) => (
                <motion.div
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block manga-panel bg-card group hover:manga-shadow transition-all duration-200
                      hover:-translate-x-[3px] hover:-translate-y-[3px]"
                  >
                    <div className="flex flex-col md:flex-row">
                      {/* Cover thumbnail */}
                      <div className="h-36 md:h-auto md:w-40 overflow-hidden border-b md:border-b-0 md:border-r-[3px] border-foreground shrink-0">
                        {post.coverImage ? (
                          <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" />
                        ) : (
                          <div className="w-full h-full bg-secondary halftone flex items-center justify-center min-h-[9rem]">
                            <span className="font-mono text-xs text-muted-foreground">NO COVER</span>
                          </div>
                        )}
                      </div>
                      <div className="halftone p-4 md:p-6 md:w-20 flex items-center justify-center border-b md:border-b-0 md:border-r-[3px] border-foreground">
                        <span className="font-mono text-sm font-bold">{post.volume}</span>
                      </div>
                      <div className="flex-1 p-6">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
                          <span className="font-mono text-xs text-muted-foreground">·</span>
                          <span className="font-mono text-xs text-muted-foreground">{post.readTime} read</span>
                        </div>
                        <h3 className="text-xl font-bold text-card-foreground group-hover:text-accent transition-colors mb-2">
                          {post.title}
                        </h3>
                        <p className="text-muted-foreground text-sm max-w-lg mb-3">{post.excerpt}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex gap-2">
                            {post.tags.map((tag) => (
                              <span key={tag} className="font-mono text-xs px-2 py-0.5 bg-secondary text-secondary-foreground border border-border">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="font-mono text-xs text-accent font-bold group-hover:translate-x-1 transition-transform">
                            READ →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-10">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="font-mono text-xs px-4 py-2 manga-panel bg-card text-card-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← PREV
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`font-mono text-xs w-9 h-9 manga-panel transition-colors
                    ${n === page
                      ? "bg-foreground text-background font-bold"
                      : "bg-card text-card-foreground hover:bg-secondary"
                    }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="font-mono text-xs px-4 py-2 manga-panel bg-card text-card-foreground hover:bg-secondary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                NEXT →
              </button>
            </div>
          )}
        </div>
      </motion.main>
    </>
  );
};

export default Archive;
