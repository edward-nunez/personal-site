import { motion } from "framer-motion";

const stats = [
  { label: "Years Exp.", value: "5+" },
  { label: "Systems Built", value: "30+" },
  { label: "Trail Miles", value: "2K+" },
  { label: "Road Miles", value: "∞" },
];

const AboutSection = () => {
  return (
    <section id="about" className="py-24 relative">
      <div className="absolute inset-0 tread-pattern" />
      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
            // Chapter 02
          </p>
          <h2 className="text-5xl md:text-6xl font-bold mb-12">
            ORIGIN<span className="text-accent">_</span>STORY
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Main about panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-2 manga-panel bg-card p-8"
          >
            <p className="text-lg leading-relaxed text-card-foreground mb-6">
              I'm a systems architect who thinks in components, whether 
              that's microservices or motorcycle carburetors. I design 
              software the way I approach a mountain pass — reading the 
              terrain, picking clean lines, and committing to the turn. 
              My work lives at the intersection of robust system design 
              and the elegance of well-machined engineering.
            </p>
            <p className="text-lg leading-relaxed text-card-foreground">
              Off the keyboard, I'm sport touring twisty roads on retrobikes, 
              sending it down singletrack on my MTB, or stripping down an 
              engine to understand how it breathes. Every machine — digital 
              or mechanical — deserves thoughtful architecture.
            </p>
          </motion.div>

          {/* Stats panel */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="manga-panel-thick bg-primary text-primary-foreground p-6 flex flex-col justify-between"
          >
            {stats.map((stat, i) => (
              <div key={stat.label} className={`${i > 0 ? "border-t border-primary-foreground/20 pt-4 mt-4" : ""}`}>
                <p className="font-mono text-3xl font-bold">{stat.value}</p>
                <p className="font-mono text-xs uppercase tracking-wider opacity-70">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
