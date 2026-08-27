import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";

const BG_IMAGES = [
  "https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=1920&q=85",
  "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=1920&q=85",
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1920&q=85",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=1920&q=85",
  "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1920&q=85",
];

const INTERVAL = 5000;

interface HeroProps {
  onOpenCatalogue: () => void;
  onScrollToHairstyles: () => void;
}

export default function Hero({ onOpenCatalogue, onScrollToHairstyles }: HeroProps) {
  const ref = useRef<HTMLElement>(null);
  const [imgIdx, setImgIdx] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.55, 0.78]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);

  useEffect(() => {
    const t = setInterval(() => setImgIdx((i) => (i + 1) % BG_IMAGES.length), INTERVAL);
    return () => clearInterval(t);
  }, []);

  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="hero" ref={ref} className="relative min-h-screen overflow-hidden flex items-center">

      {/* ── Background crossfade ── */}
      <div className="absolute inset-0 z-0">
        {BG_IMAGES.map((src, i) => (
          <AnimatePresence key={src}>
            {i === imgIdx && (
              <motion.div
                key={src + i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: "easeInOut" }}
                className="absolute inset-0"
              >
                <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading={i === 0 ? "eager" : "lazy"} />
              </motion.div>
            )}
          </AnimatePresence>
        ))}
        {/* Dark overlay */}
        <motion.div
          className="absolute inset-0 z-10"
          style={{ opacity: overlayOpacity, background: "linear-gradient(135deg, rgba(43,33,24,0.85) 0%, rgba(62,39,35,0.6) 50%, rgba(43,33,24,0.5) 100%)" }}
        />
      </div>

      {/* ── Content ── */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-20 w-full"
      >
        <div className="wrap grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center min-h-screen py-36 lg:py-0"
          style={{ minHeight: "100svh" }}
        >

          {/* ── Left: Editorial Text ── */}
          <div>
            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="flex items-center gap-3 mb-8"
            >
              <div className="w-8 h-px" style={{ background: "#C6A15B" }} />
              <span className="font-body font-semibold tracking-[0.28em] text-white/70" style={{ fontSize: "0.62rem" }}>
                POONGOTHAI FAMILY SALON
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
              className="text-white font-heading font-bold leading-[0.95] mb-6"
              style={{ fontSize: "clamp(3.2rem, 7vw, 5.8rem)", letterSpacing: "-0.03em" }}
            >
              YOUR LOOK.
              <br />
              <span style={{ color: "#C6A15B" }}>YOUR</span>
              <em className="not-italic"> MOMENT.</em>
            </motion.h1>

            {/* Thin rule */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: 1, opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.6 }}
              className="origin-left mb-8"
              style={{ width: 48, height: 1, background: "rgba(255,255,255,0.3)" }}
            />

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.7 }}
              className="text-white/65 font-body leading-relaxed mb-10 max-w-sm"
              style={{ fontSize: "clamp(0.9rem, 1.5vw, 1.05rem)" }}
            >
              Modern hair, beauty and bridal experiences designed around you — in the heart of Velachery.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <button
                onClick={onOpenCatalogue}
                className="group flex items-center gap-3 font-body font-medium text-white transition-all duration-300"
                style={{
                  background: "#5C3A2E",
                  border: "1px solid rgba(198,161,91,0.3)",
                  padding: "14px 28px",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  borderRadius: 2,
                }}
              >
                Explore Hairstyles
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onScrollToHairstyles}
                className="group flex items-center gap-3 font-body font-medium transition-all duration-300"
                style={{
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.25)",
                  color: "#fff",
                  padding: "14px 28px",
                  fontSize: "0.8rem",
                  letterSpacing: "0.1em",
                  borderRadius: 2,
                  backdropFilter: "blur(8px)",
                }}
              >
                Hairstyle Pictures
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          </div>

          {/* ── Right: Layered visual design ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:flex items-center justify-center relative"
            style={{ minHeight: 480 }}
          >
            {/* Decorative circle */}
            <div
              className="absolute"
              style={{
                width: 320,
                height: 320,
                borderRadius: "50%",
                border: "1px solid rgba(198,161,91,0.2)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />
            <div
              className="absolute"
              style={{
                width: 240,
                height: 240,
                borderRadius: "50%",
                border: "1px solid rgba(255,255,255,0.08)",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}
            />

            {/* Floating card */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
              className="relative glass rounded-2xl p-6 shadow-2xl"
              style={{ width: 260 }}
            >
              {/* EST badge */}
              <div className="mb-4 flex items-center gap-2">
                <div className="w-5 h-px" style={{ background: "#C6A15B" }} />
                <span className="font-body font-semibold tracking-[0.22em]" style={{ fontSize: "0.6rem", color: "#C6A15B" }}>
                  EST. FAMILY SALON
                </span>
              </div>

              <h3 className="font-heading font-bold text-white mb-2" style={{ fontSize: "1.4rem", lineHeight: 1.1 }}>
                Hair · Beauty
                <br />· Bridal
              </h3>

              <p className="font-body text-white/55 mb-5" style={{ fontSize: "0.75rem", lineHeight: 1.6 }}>
                Every service crafted with expertise and personal care.
              </p>

              {/* Carousel dots */}
              <div className="flex gap-1.5">
                {BG_IMAGES.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIdx(i)}
                    className="rounded-full transition-all duration-500"
                    style={{ width: i === imgIdx ? 18 : 5, height: 5, background: i === imgIdx ? "#C6A15B" : "rgba(255,255,255,0.3)" }}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Side decorative line */}
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ delay: 1, duration: 1.2 }}
              className="absolute right-10 origin-top"
              style={{ width: 1, height: 100, background: "linear-gradient(to bottom, transparent, rgba(198,161,91,0.5), transparent)", top: "10%" }}
            />
          </motion.div>
        </div>
      </motion.div>

      {/* ── Scroll cue ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
          <ArrowDown className="w-4 h-4 text-white/35" />
        </motion.div>
        <button
          onClick={() => scrollTo("hairstyles")}
          className="font-body tracking-[0.22em] text-white/35 hover:text-white/60 transition-colors"
          style={{ fontSize: "0.58rem" }}
        >
          SCROLL
        </button>
      </motion.div>
    </section>
  );
}
