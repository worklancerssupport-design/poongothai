import { useRef, useState, useCallback, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";
import type { ShopImage } from "@/lib/fetchData";

/* ── Lightbox ── */
function Lightbox({
  images,
  idx,
  onClose,
  onNav,
}: {
  images: ShopImage[];
  idx: number;
  onClose: () => void;
  onNav: (i: number) => void;
}) {
  const img = images[idx];

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNav((idx - 1 + images.length) % images.length);
      if (e.key === "ArrowRight") onNav((idx + 1) % images.length);
    },
    [onClose, onNav, idx, images.length]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      className="fixed inset-0 z-300 flex items-center justify-center p-4 sm:p-8"
      style={{ background: "rgba(43,33,24,0.96)" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-10 w-11 h-11 rounded-full flex items-center justify-center text-white transition-colors"
        style={{ background: "rgba(255,255,255,0.12)" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.22)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
        aria-label="Close"
      >
        <X className="w-5 h-5" />
      </button>

      <motion.div
        key={idx}
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-5xl rounded-2xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "88vh", border: "1px solid rgba(232,216,195,0.2)" }}
      >
        <div className="relative bg-black" style={{ aspectRatio: "16/10" }}>
          <img
            src={img.src}
            alt={img.alt}
            className="absolute inset-0 w-full h-full object-cover"
            loading="eager"
          />
        </div>

        {/* Caption */}
        <div
          className="absolute bottom-0 inset-x-0 p-6 flex items-center justify-between"
          style={{ background: "linear-gradient(to top, rgba(43,33,24,0.9) 0%, transparent)" }}
        >
          <div>
            <p className="text-white font-heading font-semibold text-lg">{img.title}</p>
            <p className="text-white/60 font-body text-xs mt-0.5">Poongothai Family Salon · Velachery</p>
          </div>
          <span className="text-xs font-body font-medium" style={{ color: "#C6A15B" }}>
            {idx + 1} / {images.length}
          </span>
        </div>

        {/* Progress dots */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                onNav(i);
              }}
              className="rounded-full transition-all"
              style={{
                width: i === idx ? 24 : 6,
                height: 6,
                background: i === idx ? "#C6A15B" : "rgba(255,255,255,0.4)",
              }}
              aria-label={`Go to image ${i + 1}`}
            />
          ))}
        </div>

        {/* Navigation arrows */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNav((idx - 1 + images.length) % images.length);
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.15)" }}
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNav((idx + 1) % images.length);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-colors backdrop-blur-sm"
          style={{ background: "rgba(255,255,255,0.15)" }}
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Gallery Section ── */
export default function Gallery() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);
  const { owner } = useDataContext();
  const SHOP_IMAGES = owner.shopImages;

  return (
    <section id="gallery" className="section relative" style={{ background: "#2B2118" }}>
      <div className="wrap">
        {/* Editorial Header */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16"
        >
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px" style={{ background: "#C6A15B" }} />
              <span className="label" style={{ color: "#C6A15B" }}>Atmosphere</span>
            </div>
            <h2
              className="font-heading font-bold text-white"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: "-0.03em", lineHeight: 1.1 }}
            >
              THE SPACE
            </h2>
          </div>
          <p className="font-body text-sm max-w-sm" style={{ color: "rgba(248,241,231,0.65)", lineHeight: 1.8 }}>
            {owner.shopSpaceDescription}
          </p>
        </motion.div>

        {/* Asymmetrical Editorial Grid: 1 Large Left + 2 Stacked Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          {/* Main Large Image (Left, 7 columns) */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 group relative overflow-hidden cursor-pointer rounded-2xl"
            style={{ minHeight: "440px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}
            onClick={() => setLightboxIdx(0)}
          >
            <img
              src={SHOP_IMAGES[0].src}
              alt={SHOP_IMAGES[0].alt}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark overlay with view indicator */}
            <div
              className="absolute inset-0 transition-opacity duration-300 p-8 flex flex-col justify-between"
              style={{ background: "linear-gradient(to top, rgba(43,33,24,0.8) 0%, rgba(43,33,24,0.2) 60%, transparent 100%)" }}
            >
              <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md text-xs font-body text-white"
                  style={{ background: "rgba(255,255,255,0.18)" }}
                >
                  <Eye className="w-3.5 h-3.5" style={{ color: "#C6A15B" }} />
                  View Space
                </span>
              </div>
              <div>
                <p className="font-heading font-bold text-xl text-white">{SHOP_IMAGES[0].title}</p>
                <p className="font-body text-xs text-white/60 mt-1">Poongothai Family Salon</p>
              </div>
            </div>
          </motion.div>

          {/* 2 Stacked Images (Right, 5 columns) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {SHOP_IMAGES.slice(1, 3).map((img, i) => {
              const actualIdx = i + 1;
              return (
                <motion.div
                  key={actualIdx}
                  initial={{ opacity: 0, y: 24 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
                  className="group relative overflow-hidden cursor-pointer rounded-2xl flex-1"
                  style={{ minHeight: "210px", boxShadow: "0 10px 40px rgba(0,0,0,0.3)" }}
                  onClick={() => setLightboxIdx(actualIdx)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div
                    className="absolute inset-0 transition-opacity duration-300 p-6 flex flex-col justify-between"
                    style={{ background: "linear-gradient(to top, rgba(43,33,24,0.8) 0%, transparent 70%)" }}
                  >
                    <div className="self-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md text-[11px] font-body text-white"
                        style={{ background: "rgba(255,255,255,0.18)" }}
                      >
                        <Eye className="w-3 h-3" style={{ color: "#C6A15B" }} />
                        View Space
                      </span>
                    </div>
                    <div>
                      <p className="font-heading font-bold text-lg text-white">{img.title}</p>
                      <p className="font-body text-xs text-white/60 mt-0.5">Poongothai Family Salon</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <Lightbox
            images={SHOP_IMAGES}
            idx={lightboxIdx}
            onClose={() => setLightboxIdx(null)}
            onNav={(i) => setLightboxIdx(i)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
