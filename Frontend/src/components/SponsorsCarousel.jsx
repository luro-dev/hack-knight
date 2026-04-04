// components/SponsorsCarousel.jsx
// Displays a scrolling row of sponsor logos on the homepage.
// Imports sponsor data from data/sponsors.js
// Has a link to the full /sponsors page.

import { Link } from 'react-router-dom';            // Link for navigating to /sponsors
import { motion } from 'motion/react';              // Framer Motion for infinite carousel loop
import { sponsors } from '../data/sponsors';        // import the sponsors array from the data folder

export default function SponsorsCarousel() {
  return (
    <section className="section-wrapper my-0.5 bg-surface rounded-3xl py-12">                                       {/* section wrapper for the sponsors carousel block */}
      <h2 className="section-title text-center">Our Sponsors</h2>                         {/* section heading */}

      {/* Horizontal scrolling row of sponsor logos */}
      <div
        className="w-full py-6 mt-4 mb-4 overflow-hidden relative flex"
        style={{
          maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
        }}
      >
        <motion.div
          className="flex items-center gap-8 w-max pr-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            ease: "linear",
            duration: 40,
            repeat: Infinity
          }}
        >
          {[...sponsors, ...sponsors].map((sponsor, index) => (
            <a
              key={index}
              href={sponsor.url}
              target="_blank"
              rel="noreferrer"
              className="card-sponsor shrink-0 w-48 h-28 flex items-center justify-center"
            >
              <img src={sponsor.logo} alt={sponsor.name} className="max-w-[80%] max-h-16 object-contain" />
            </a>
          ))}
        </motion.div>
      </div>

      <div className="text-center">
        <Link to="/sponsors" className="btn-outline">View All Sponsors</Link> {/* navigates to the dedicated /sponsors page */}
      </div>
    </section>
  );
}