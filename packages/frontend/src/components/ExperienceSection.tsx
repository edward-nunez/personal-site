import { motion } from 'framer-motion';
import type { Experience } from '@/types';
import { formatPeriod } from '@/utils/formatters';
import { useExperiences } from '@/hooks/useExperiences';

const ExperienceSection = () => {
  const { experiences, isLoading, isError, error } = useExperiences();

  return (
    <section id="experience" className="py-24 relative">
      <div className="absolute inset-0 tread-pattern" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
            // Chapter 03
          </p>
          <h2 className="text-5xl md:text-6xl font-bold mb-12">
            MILEAGE<span className="text-accent">_</span>LOG
          </h2>
        </motion.div>

        {isError && (
          <div className="manga-panel bg-destructive/10 border border-destructive text-destructive px-6 py-4 font-mono text-sm">
            {error?.message ?? 'Failed to load experience.'}
          </div>
        )}

        {isLoading && (
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="md:pl-20 manga-panel bg-card animate-pulse flex flex-col md:flex-row"
              >
                <div className="p-6 md:w-48 border-b md:border-b-0 md:border-r-[3px] border-foreground">
                  <div className="h-4 w-24 bg-secondary/50 rounded" />
                </div>
                <div className="flex-1 p-6 space-y-3">
                  <div className="h-5 w-48 bg-secondary/50 rounded" />
                  <div className="h-4 w-32 bg-secondary/50 rounded" />
                  <div className="h-4 w-full bg-secondary/50 rounded" />
                  <div className="flex gap-2 mt-4">
                    {[1, 2, 3].map((j) => (
                      <div key={j} className="h-6 w-16 bg-secondary/50 rounded" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!isLoading && !isError && (
          <div className="relative">
            <div className="absolute left-0 md:left-8 top-0 bottom-0 w-[3px] bg-foreground hidden md:block" />

            <div className="space-y-6">
              {experiences.map((exp: Experience, i: number) => (
                <motion.div
                  key={exp.id}
                  initial={{ opacity: 0, x: 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="md:pl-20 relative"
                >
                  <div className="hidden md:block absolute left-[22px] top-8 w-[15px] h-[15px] bg-accent border-[3px] border-foreground" />

                  <div className="manga-panel bg-card hover:manga-shadow transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px]">
                    <div className="flex flex-col md:flex-row">
                      <div className="p-6 md:w-48 border-b md:border-b-0 md:border-r-[3px] border-foreground flex items-center">
                        <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground">
                          {formatPeriod(exp.startDate, exp.endDate)}
                        </span>
                      </div>

                      <div className="flex-1 p-6">
                        <h3 className="text-xl font-bold text-card-foreground">{exp.role}</h3>
                        <p className="font-mono text-sm text-accent font-semibold mt-1">
                          {exp.company}
                        </p>
                        {exp.description && (
                          <p className="text-muted-foreground mt-3">{exp.description}</p>
                        )}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {exp.technologies.map((t) => (
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
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExperienceSection;
