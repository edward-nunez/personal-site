import { motion } from 'framer-motion';
import type { ToolkitCategory } from '@/types';
import { useToolkit } from '@/hooks/useToolkit';

function getColorClass(slug: ToolkitCategory['slug']): string {
  if (slug === 'strong') return 'text-green-500';
  if (slug === 'gaps') return 'text-amber-500';
  return 'text-foreground';
}

const SkillsSection = () => {
  const { categories, isLoading, isError, error } = useToolkit();

  return (
    <section id="skills" className="py-24 relative">
      <div className="absolute inset-0 chain-links opacity-30" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
            // Chapter 04
          </p>
          <h2 className="text-5xl md:text-6xl font-bold mb-12">
            TOOL<span className="text-accent">_</span>KIT
          </h2>
        </motion.div>

        {isError && (
          <div className="manga-panel-thick bg-destructive/10 border border-destructive text-destructive px-6 py-4 font-mono text-sm">
            {error?.message ?? 'Failed to load toolkit.'}
          </div>
        )}

        {isLoading && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="manga-panel-thick bg-card p-6 animate-pulse space-y-4">
                <div className="h-4 w-24 bg-secondary/50 rounded mb-6" />
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="h-4 w-full bg-secondary/50 rounded" />
                ))}
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, i) => {
              const colorClass = getColorClass(category.slug);
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="manga-panel-thick bg-card p-6 hover:manga-shadow transition-all duration-200
                    hover:-translate-x-[3px] hover:-translate-y-[3px]"
                >
                  <h3
                    className={`font-mono text-sm font-bold tracking-widest ${colorClass} mb-6 pb-3 border-b-[3px] border-foreground`}
                  >
                    {category.title}
                  </h3>
                  <ul className="space-y-3">
                    {category.items.map((item) => (
                      <li
                        key={item}
                        className="font-mono text-sm text-card-foreground flex items-center gap-2"
                      >
                        <span className={`${colorClass} text-lg leading-none`}>▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
