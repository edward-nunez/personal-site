import { useParams, Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { blogPosts } from "@/data/blogPosts";
import Navbar from "@/components/Navbar";

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const postIndex = blogPosts.findIndex((p) => p.slug === slug);
  const post = blogPosts[postIndex];

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold mb-4">404</h1>
          <p className="text-muted-foreground mb-6 font-mono">Post not found in the ride log.</p>
          <Link to="/#blog" className="font-mono text-sm text-accent hover:underline">
            ← BACK TO BASE
          </Link>
        </div>
      </div>
    );
  }

  const prevPost = postIndex > 0 ? blogPosts[postIndex - 1] : null;
  const nextPost = postIndex < blogPosts.length - 1 ? blogPosts[postIndex + 1] : null;

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
              to="/#blog"
              className="font-mono text-xs tracking-widest text-muted-foreground hover:text-foreground transition-colors"
            >
              ← BACK TO BASE
            </Link>
            <span className="font-mono text-xs text-muted-foreground">{post.volume}</span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="w-full h-64 md:h-80 overflow-hidden border-b-[3px] border-foreground">
          {post.coverImage ? (
            <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-secondary halftone flex items-center justify-center">
              <span className="font-mono text-sm text-muted-foreground">NO COVER IMAGE</span>
            </div>
          )}
        </div>

        {/* Hero */}
        <div className="container mx-auto px-6 lg:px-12 py-12 md:py-20">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-xs text-muted-foreground">{post.date}</span>
              <span className="font-mono text-xs text-muted-foreground">·</span>
              <span className="font-mono text-xs text-muted-foreground">{post.readTime} read</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">{post.title}</h1>

            <div className="flex gap-2 mb-8">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-xs px-3 py-1 bg-secondary text-secondary-foreground border border-border"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="h-[5px] bg-foreground w-24 manga-shadow-sm" />
          </div>
        </div>

        {/* Article body */}
        <div className="container mx-auto px-6 lg:px-12 pb-20">
          <article className="space-y-6">
            {post.content.map((block, i) => {
              switch (block.type) {
                case "heading":
                  return (
                    <h2
                      key={i}
                      className="text-2xl md:text-3xl font-bold mt-12 mb-4 first:mt-0"
                    >
                      {block.text}
                    </h2>
                  );
                case "paragraph":
                  return (
                    <p key={i} className="text-base md:text-lg leading-relaxed text-muted-foreground">
                      {block.text}
                    </p>
                  );
                case "blockquote":
                  return (
                    <blockquote
                      key={i}
                      className="manga-panel border-l-[5px] border-accent pl-6 py-4 pr-4 bg-secondary/50 italic text-foreground font-medium"
                    >
                      {block.text}
                    </blockquote>
                  );
                case "code":
                  return (
                    <div key={i} className="manga-panel-thick bg-card overflow-x-auto">
                      <div className="flex items-center justify-between px-4 py-2 border-b-[3px] border-foreground halftone">
                        <span className="font-mono text-xs font-bold">{block.language || "code"}</span>
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

          {/* Prev / Next navigation */}
          <div className="mt-20 pt-8 border-t-[3px] border-foreground">
            <div className="flex items-center justify-between">
              {prevPost ? (
                <Link
                  to={`/blog/${prevPost.slug}`}
                  className="group"
                >
                  <span className="font-mono text-xs text-muted-foreground block mb-1">← PREV POST</span>
                  <span className="font-bold text-sm group-hover:text-accent transition-colors">
                    {prevPost.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}
              {nextPost ? (
                <Link
                  to={`/blog/${nextPost.slug}`}
                  className="group text-right"
                >
                  <span className="font-mono text-xs text-muted-foreground block mb-1">NEXT POST →</span>
                  <span className="font-bold text-sm group-hover:text-accent transition-colors">
                    {nextPost.title}
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

export default BlogPost;
