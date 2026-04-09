import { useState, useEffect } from "react";  // added useEffect
import { AnimatePresence } from "motion/react";

import GALLERY_DATA from "../data/gallery";
import Slideshow from "./Slideshow";

export default function PhotoGallery() {
  const [index, setIndex]         = useState(0);
  const [direction, setDirection] = useState(1);

  function handleNext() {
    setDirection(1);
    setIndex((prev) => (prev + 1) % GALLERY_DATA.length);
  }

  function handlePrev() {
    setDirection(-1);
    setIndex((prev) => (prev - 1 + GALLERY_DATA.length) % GALLERY_DATA.length);
  }

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(handleNext, 10000);
    return () => clearInterval(timer);
  }, [index]);

  const current = GALLERY_DATA[index];

  return (
    <section id="photos" className="section-wrapper py-24">
      <h2 className="section-title text-center">Past Event Highlights</h2>

      <div className="relative mt-10">

        {/* Left Arrow (offset by 22px to account for the year header so it centers strictly on the photos) */}
        <button 
          onClick={handlePrev}
          className="absolute left-0 md:-left-12 top-[calc(50%+28px)] -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:border-ultraviolet hover:text-ultraviolet hover:shadow-glow transition-all z-10"
          aria-label="Previous year"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>

        {/* Sliding viewport */}
        <div className="relative w-full overflow-hidden px-12 md:px-0">
          <AnimatePresence mode="wait" custom={direction}>
            <Slideshow
              key={current.year}
              year={current.year}
              photos={current.photos}
              direction={direction}
            />
          </AnimatePresence>
        </div>

        {/* Right Arrow */}
        <button 
          onClick={handleNext}
          className="absolute right-0 md:-right-12 top-[calc(50%+28px)] -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-surface border border-border text-text-secondary hover:border-ultraviolet hover:text-ultraviolet hover:shadow-glow transition-all z-10"
          aria-label="Next year"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

      </div>

    </section>
  );
}