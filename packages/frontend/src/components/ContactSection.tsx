import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AnimatedLogo from '@/components/AnimatedLogo';
import ContactFormModal from '@/components/ContactFormModal';
const ContactSection = () => {
  const [isContactOpen, setIsContactOpen] = useState(false);

  return (
    <>
      <section id="contact" className="py-24 relative">
        <div className="absolute inset-0 halftone" />
        <div className="container mx-auto px-6 lg:px-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <p className="font-mono text-sm text-muted-foreground tracking-widest uppercase mb-2">
              // Final Chapter
            </p>
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              LET'S<span className="text-accent">_</span>RIDE
            </h2>

            <div className="manga-panel-thick bg-card p-8 md:p-12 manga-shadow text-left">
              <div className="flex flex-col items-center mb-8">
                <AnimatedLogo className="h-20 w-auto mb-4" />
                <h3 className="font-bold text-2xl md:text-3xl tracking-tight">EDWARD NUNEZ</h3>
                <p className="font-mono text-sm tracking-widest uppercase text-accent mt-1">
                  Systems Architect
                </p>
              </div>
              <p className="text-lg text-card-foreground mb-8 text-center">
                Looking to build resilient systems, talk architecture patterns, or swap notes on the
                best sport touring routes? I'm always down for a good conversation — digital or
                trailside.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
                <button
                  onClick={() => setIsContactOpen(true)}
                  className="manga-panel bg-accent text-accent-foreground px-8 py-4 font-mono text-sm font-bold text-center
                  hover:manga-shadow-sm transition-all duration-200 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]"
                >
                  SEND_EMAIL( )
                </button>
                <Link
                  to="/consultation"
                  className="manga-panel bg-accent text-accent-foreground px-8 py-4 font-mono text-sm font-bold text-center
                  hover:manga-shadow-sm transition-all duration-200 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]"
                >
                  REQUEST_CONSULTATION( )
                </Link>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manga-panel bg-primary text-primary-foreground px-8 py-4 font-mono text-sm font-bold text-center
                  hover:manga-shadow-sm transition-all duration-200 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]"
                >
                  GITHUB( )
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="manga-panel bg-card text-card-foreground px-8 py-4 font-mono text-sm font-bold text-center
                  hover:manga-shadow-sm transition-all duration-200 hover:-translate-x-[1.5px] hover:-translate-y-[1.5px]"
                >
                  LINKEDIN( )
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
      <ContactFormModal isOpen={isContactOpen} onClose={() => setIsContactOpen(false)} />
    </>
  );
};

export default ContactSection;
