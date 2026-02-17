import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useBlogPosts } from '@/hooks/useBlog';

const BlogSection = () => {
  const { posts, isLoading, isError, error } = useBlogPosts({ limit: 4 });

  return (
    <section id="blog" className="py-24">
      <div className="container mx-auto px-6 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
            // Chapter 07
          </p>
          <h2 className="text-5xl md:text-6xl font-bold mb-12">
            RIDE<span className="text-accent">_</span>NOTES
          </h2>
        </motion.div>

        {isError && (
          <div className="manga-panel bg-destructive/10 border border-destructive text-destructive px-6 py-4 font-mono text-sm">
            {error?.message ?? 'Failed to load posts.'}
          </div>
        )}

        {isLoading && (
          <div className="grid md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="manga-panel-thick bg-card animate-pulse">
                <div className="h-40 bg-secondary/50" />
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-secondary/50 w-1/3" />
                  <div className="h-6 bg-secondary/50 w-2/3" />
                  <div className="h-4 bg-secondary/50 w-full" />
                  <div className="h-4 bg-secondary/50 w-4/5" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <div className="grid md:grid-cols-2 gap-6">
              {posts.slice(0, 4).map((post, i) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Link
                    to={`/blog/${post.slug}`}
                    className="block manga-panel-thick bg-card group
                      hover:manga-shadow transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px]"
                  >
                    <div className="h-40 overflow-hidden border-b-[3px] border-foreground">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-secondary halftone flex items-center justify-center">
                          <span className="font-mono text-xs text-muted-foreground">NO COVER</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between px-6 py-3 border-b-[3px] border-foreground halftone">
                      <span className="font-mono text-sm font-bold">
                        {post.volume ?? `Vol.${String(i + 1).padStart(2, '0')}`}
                      </span>
                      <span className="font-mono text-xs text-muted-foreground">
                        {post.readTime} read
                      </span>
                    </div>

                    <div className="p-6">
                      <p className="font-mono text-xs text-muted-foreground mb-2">{post.date}</p>
                      <h3 className="text-xl font-bold text-card-foreground mb-3 group-hover:text-accent transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                        {post.excerpt ?? ''}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                          {post.tags.map((tag) => (
                            <span
                              key={tag}
                              className="font-mono text-xs px-2 py-1 bg-secondary text-secondary-foreground border border-border"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        <span className="font-mono text-xs text-accent font-bold group-hover:translate-x-1 transition-transform">
                          READ →
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>

            <div className="flex justify-center mt-10">
              <Link
                to="/archive#blog"
                className="manga-panel bg-card px-8 py-3 font-mono text-sm font-bold tracking-widest
                  hover:manga-shadow hover:-translate-x-[3px] hover:-translate-y-[3px] transition-all duration-200
                  text-card-foreground hover:text-accent"
              >
                VIEW ALL RIDE NOTES →
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
