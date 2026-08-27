import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, ShieldCheck, Quote } from "lucide-react";
import { testimonialsData } from "@/data/testimonials";

export default function Testimonials() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const total = testimonialsData.length;

  // Gentle auto-play that pauses on hover
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % total);
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, total]);

  const currentTestimonial = testimonialsData[currentIndex];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <section
      id="reviews"
      className="section relative overflow-hidden"
      style={{ background: "#2B2118" }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Decorative Ambient Shapes */}
      <div
        className="absolute -left-20 top-1/3 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-10"
        style={{ background: "#C6A15B" }}
      />
      <div
        className="absolute -right-20 bottom-10 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-5"
        style={{ background: "#5C3A2E" }}
      />

      <div className="wrap relative z-10">
        {/* ── Section Heading ── */}
        <div ref={ref} className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 mb-3">
              <span className="w-6 h-px bg-[#C6A15B]" />
              <span className="font-body text-[10px] font-bold uppercase tracking-[0.28em] text-[#C6A15B]">
                CLIENT STORIES
              </span>
              <span className="w-6 h-px bg-[#C6A15B]" />
            </div>

            <h2
              className="font-heading font-bold text-white mb-3"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              Real experiences.
              <br />
              <span style={{ color: "#C6A15B" }}>Real confidence.</span>
            </h2>

            <p className="font-body text-xs sm:text-sm text-white/60 leading-relaxed max-w-md mx-auto">
              &ldquo;Every visit is more than a service. It is an experience our clients remember.&rdquo;
            </p>
          </motion.div>
        </div>

        {/* ── Featured Customer Story Showcase Card ── */}
        <div className="max-w-4xl mx-auto">
          <div
            className="relative rounded-2xl sm:rounded-3xl p-7 sm:p-12 border border-white/10 shadow-2xl backdrop-blur-md"
            style={{ background: "rgba(62,39,35,0.45)" }}
          >
            {/* Top Row: Stars + Pagination Counter */}
            <div className="flex items-center justify-between gap-4 mb-8">
              {/* Gold 5 Stars */}
              <div className="flex items-center gap-1">
                {[...Array(currentTestimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#C6A15B] text-[#C6A15B]" />
                ))}
              </div>

              {/* Numbered Pagination Indicator */}
              <div className="font-body text-xs font-semibold tracking-widest text-[#C6A15B] select-none">
                {(currentIndex + 1).toString().padStart(2, "0")}{" "}
                <span className="text-white/30 font-normal">/ {total.toString().padStart(2, "0")}</span>
              </div>
            </div>

            {/* Main Review Quote Text */}
            <div className="min-h-[140px] sm:min-h-[160px] flex items-center relative mb-8">
              <Quote className="w-12 h-12 sm:w-16 sm:h-16 text-[#C6A15B] opacity-10 absolute -top-4 -left-2 pointer-events-none" />

              <AnimatePresence mode="wait">
                <motion.blockquote
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="font-heading italic text-white/95 text-lg sm:text-2xl lg:text-[1.7rem] leading-relaxed relative z-10"
                >
                  &ldquo;{currentTestimonial.text}&rdquo;
                </motion.blockquote>
              </AnimatePresence>
            </div>

            {/* Bottom Row: Author Bio + Arrow Navigation Controls */}
            <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              {/* Author Info */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-3.5"
                >
                  <div className="relative w-12 h-12 rounded-full overflow-hidden border border-[#C6A15B] shrink-0">
                    <img
                      src={currentTestimonial.avatar}
                      alt={currentTestimonial.name}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-heading font-bold text-white text-base sm:text-lg">
                        {currentTestimonial.name}
                      </h4>
                      {currentTestimonial.verified && (
                        <span
                          className="inline-flex items-center gap-1 text-[9px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
                          style={{ background: "rgba(198,161,91,0.15)", color: "#C6A15B" }}
                        >
                          <ShieldCheck className="w-2.5 h-2.5" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="font-body text-xs text-[#C6A15B] mt-0.5">
                      {currentTestimonial.service}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Navigation Controls */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                <button
                  onClick={handlePrev}
                  className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:border-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#3E2723]"
                  aria-label="Previous review"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  onClick={handleNext}
                  className="w-11 h-11 rounded-full border border-white/20 text-white flex items-center justify-center transition-all duration-200 hover:border-[#C6A15B] hover:bg-[#C6A15B] hover:text-[#3E2723]"
                  aria-label="Next review"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Thumbnail Story Jump Indicators */}
            <div className="flex items-center justify-center gap-2 mt-8 pt-6 border-t border-white/5">
              {testimonialsData.map((item, idx) => {
                const isActive = idx === currentIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentIndex(idx)}
                    className="relative transition-all duration-300 rounded-full group"
                    style={{
                      width: isActive ? 28 : 8,
                      height: 8,
                      background: isActive ? "#C6A15B" : "rgba(255,255,255,0.2)",
                    }}
                    aria-label={`Jump to review by ${item.name}`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* ── Integrated Customer Experience Metrics Strip ── */}
        <div className="mt-16 pt-12 border-t border-white/10 max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {/* Metric 1 */}
            <div className="pt-4 sm:pt-0">
              <p className="font-heading font-bold text-3xl sm:text-4xl text-white">15+</p>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C6A15B] mt-1.5">
                YEARS OF EXPERIENCE
              </p>
            </div>

            {/* Metric 2 */}
            <div className="pt-4 sm:pt-0">
              <p className="font-heading font-bold text-3xl sm:text-4xl text-white">12,000+</p>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C6A15B] mt-1.5">
                HAPPY CLIENTS
              </p>
            </div>

            {/* Metric 3 */}
            <div className="pt-4 sm:pt-0">
              <div className="flex items-center justify-center gap-1 font-heading font-bold text-3xl sm:text-4xl text-white">
                <Star className="w-6 h-6 fill-[#C6A15B] text-[#C6A15B]" />
                4.6
              </div>
              <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#C6A15B] mt-1.5">
                GOOGLE RATING (500+ REVIEWS)
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
