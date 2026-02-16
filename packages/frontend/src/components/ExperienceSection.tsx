import { motion } from "framer-motion";

const experiences = [
  {
    period: "2023 — Present",
    role: "Senior Systems Architect",
    company: "TechCorp Inc.",
    description: "Designing distributed platform architecture for 50K+ users. Leading event-driven migrations and establishing system design standards across teams.",
    tech: ["System Design", "Kafka", "React", "AWS"],
  },
  {
    period: "2021 — 2023",
    role: "Full-Stack Engineer",
    company: "StartupXYZ",
    description: "Built core platform from zero to launch. Owned the API layer, designed database schemas, and established CI/CD pipelines.",
    tech: ["Node.js", "React Native", "PostgreSQL"],
  },
  {
    period: "2019 — 2021",
    role: "Frontend Engineer",
    company: "DigitalAgency Co.",
    description: "Delivered component-driven interfaces for enterprise clients. Introduced design systems and performance budgets across projects.",
    tech: ["Vue.js", "SCSS", "Jest"],
  },
  {
    period: "2018 — 2019",
    role: "Junior Developer",
    company: "WebWorks Studio",
    description: "Built responsive interfaces and internal tooling. First taste of production systems and the art of shipping reliable code.",
    tech: ["JavaScript", "PHP", "MySQL"],
  },
];

const ExperienceSection = () => {
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

        <div className="relative">
          <div className="absolute left-0 md:left-8 top-0 bottom-0 w-[3px] bg-foreground hidden md:block" />

          <div className="space-y-6">
            {experiences.map((exp, i) => (
              <motion.div
                key={exp.role}
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
                      <span className="font-mono text-xs font-bold tracking-wider text-muted-foreground">{exp.period}</span>
                    </div>

                    <div className="flex-1 p-6">
                      <h3 className="text-xl font-bold text-card-foreground">{exp.role}</h3>
                      <p className="font-mono text-sm text-accent font-semibold mt-1">{exp.company}</p>
                      <p className="text-muted-foreground mt-3">{exp.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.tech.map((t) => (
                          <span key={t} className="font-mono text-xs px-2 py-1 bg-secondary text-secondary-foreground border border-border">
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
      </div>
    </section>
  );
};

export default ExperienceSection;
