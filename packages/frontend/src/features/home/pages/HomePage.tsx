import { Hero, FeaturedProjects, RecentBlogPosts, CTA } from '../components';

export function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedProjects />
      <RecentBlogPosts />
      <CTA />
    </main>
  );
}
