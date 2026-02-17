import { motion } from 'framer-motion';
import mangaHero from '@/assets/manga-hero.jpg';

const HeroSection = () => {
  return (
    <section className="min-h-screen relative flex items-center overflow-hidden">
      {/* Speed lines background */}
      <div className="absolute inset-0 speed-lines opacity-40" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <p className="font-mono text-sm tracking-widest uppercase text-muted-foreground">
                // Ignition
              </p>
              <h1 className="text-6xl md:text-8xl font-bold leading-[0.9] tracking-tight">
                EDWARD
                <br />
                <span className="text-stroke">NUNEZ</span>
              </h1>
              <p className="font-mono text-lg md:text-xl tracking-widest uppercase text-accent mt-3">
                Systems Architect
              </p>
            </div>

            <div className="manga-panel p-4 max-w-md bg-card">
              <p className="font-mono text-sm leading-relaxed text-card-foreground">
                &gt; Engineering resilient systems like a well-tuned
                <span className="text-accent font-semibold"> engine</span>. Sport touring the
                backroads, shredding singletrack, and designing architecture that
                <span className="text-accent font-semibold"> endures</span>.
              </p>
            </div>

            <div className="flex gap-4 pt-2">
              <a
                href="#projects"
                className="manga-panel bg-primary text-primary-foreground px-6 py-3 font-mono text-sm font-semibold 
                  hover:manga-shadow transition-all duration-200 hover:-translate-x-[3px] hover:-translate-y-[3px]"
              >
                VIEW_BUILDS( )
              </a>
              <a
                href="#contact"
                className="manga-panel bg-card text-card-foreground px-6 py-3 font-mono text-sm font-semibold
                  hover:manga-shadow-sm transition-all duration-200 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]"
              >
                CONNECT( )
              </a>
            </div>
          </motion.div>

          {/* Manga illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="relative"
          >
            <div className="manga-panel-thick manga-shadow">
              <img
                src={mangaHero}
                alt="Manga-style illustration with retro motorcycle and mountain bike"
                className="w-full h-auto"
              />
            </div>
            {/* Speech bubble */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.4 }}
              className="absolute -bottom-6 -left-4 md:-left-8 bg-card manga-panel p-3 md:p-4 max-w-[220px]"
            >
              <div className="absolute -top-2 right-8 w-4 h-4 bg-card border-t-[3px] border-l-[3px] border-foreground rotate-45" />
              <p className="font-mono text-xs text-card-foreground font-semibold">
                "Ride it. Build it. Ship it."
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono text-xs text-muted-foreground"
      >
        ↓ SCROLL ↓
      </motion.div>
    </section>
  );
};

export default HeroSection;
