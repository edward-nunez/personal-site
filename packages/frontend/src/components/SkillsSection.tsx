import { motion } from "framer-motion";

const skillCategories = [
  {
    title: "STRONG",
    skills: ["System Design & Architecture", "Event-Driven Systems", "Distributed Computing", "API Design & Integration", "Observability & Monitoring"],
  },
  {
    title: "MODERATE",
    skills: ["Cloud Infrastructure", "Team Leadership", "Data Modeling & Pipelines", "Developer Tooling", "Performance Optimization"],
  },
  {
    title: "GAPS — Honest Audit",
    skills: ["Machine Learning / AI", "Mobile-Native Development", "Security Engineering", "Data Science & Analytics", "Embedded Systems"],
  },
];

const SkillsSection = () => {
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, i) => {
            const colorClass = category.title === "STRONG"
              ? "text-green-500"
              : category.title.startsWith("GAPS")
                ? "text-amber-500"
                : "text-foreground";
            return (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="manga-panel-thick bg-card p-6 hover:manga-shadow transition-all duration-200
                hover:-translate-x-[3px] hover:-translate-y-[3px]"
            >
              <h3 className={`font-mono text-sm font-bold tracking-widest ${colorClass} mb-6 pb-3 border-b-[3px] border-foreground`}>
                {category.title}
              </h3>
              <ul className="space-y-3">
                {category.skills.map((skill) => (
                  <li key={skill} className="font-mono text-sm text-card-foreground flex items-center gap-2">
                    <span className={`${colorClass} text-lg leading-none`}>▸</span>
                    {skill}
                  </li>
                ))}
              </ul>
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
