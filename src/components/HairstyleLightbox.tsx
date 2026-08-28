import type { Hairstyle } from "@/data/hairstyles";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Clock, X } from "lucide-react";
import { useCallback, useEffect } from "react";

interface Props {
  hairstyle: Hairstyle | null;
  all: Hairstyle[];
  onClose: () => void;
  onNavigate: (h: Hairstyle) => void;
}

const maintenanceBadge = {
  Low:    { bg: "#ECFDF5", text: "#059669" },
  Medium: { bg: "#FFFBEB", text: "#D97706" },
  High:   { bg: "#FEF2F2", text: "#DC2626" },
};

export default function HairstyleLightbox({ hairstyle, all, onClose, onNavigate }: Props) {
  const idx  = hairstyle ? all.findIndex((h) => h.id === hairstyle.id) : -1;
  const prev = idx > 0              ? all[idx - 1] : null;
  const next = idx < all.length - 1 ? all[idx + 1] : null;

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape")     onClose();
    if (e.key === "ArrowLeft"  && prev) onNavigate(prev);
    if (e.key === "ArrowRight" && next) onNavigate(next);
  }, [onClose, prev, next, onNavigate]);

  useEffect(() => {
    if (!hairstyle) return;
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [hairstyle, handleKey]);

  const badge = hairstyle ? maintenanceBadge[hairstyle.maintenance] : null;

  return (
    <AnimatePresence>
      {hairstyle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28 }}
          className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-8"
          onClick={onClose}
        >
          {/* Blurred backdrop */}
          <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(0,0,0,0.75)" }} />

          <motion.div
            key={hairstyle.id}
            initial={{ scale: 0.93, opacity: 0, y: 20 }}
            animate={{ scale: 1,    opacity: 1, y: 0  }}
            exit={{   scale: 0.96,  opacity: 0, y: 10 }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative bg-white w-full max-w-3xl max-h-[90vh] overflow-hidden rounded-2xl grid grid-cols-1 sm:grid-cols-2 shadow-2xl"
          >
            {/* ── Image pane ── */}
            <div className="relative bg-[#E8E4DE]" style={{ minHeight: "340px" }}>
              <img
                src={hairstyle.image.replace("w=400", "w=900")}
                alt={hairstyle.name}
                className="absolute inset-0 w-full h-full object-cover"
                loading="eager"
              />

              {/* Prev / Next arrows */}
              {prev && (
                <button
                  onClick={() => onNavigate(prev)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-4 h-4" style={{ color: "#2B2118" }} />
                </button>
              )}
              {next && (
                <button
                  onClick={() => onNavigate(next)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-4 h-4" style={{ color: "#2B2118" }} />
                </button>
              )}

              {/* Counter pill */}
              <div
                className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white text-xs font-body px-3 py-1 rounded-full"
                style={{ background: "rgba(0,0,0,0.45)" }}
              >
                {idx + 1} / {all.length}
              </div>
            </div>

            {/* ── Details pane ── */}
            <div className="p-7 flex flex-col justify-between overflow-y-auto no-scrollbar">
              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "#FAF7F0" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#E8D8C3")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#FAF7F0")}
                aria-label="Close"
              >
                <X className="w-4 h-4" style={{ color: "#2B2118" }} />
              </button>

              <div>
                <p className="label mb-2">
                  {hairstyle.gender === "men" ? "Men's Style" : "Women's Style"}
                </p>
                <h2 className="font-heading font-bold text-2xl mb-4" style={{ color: "#5C3A2E" }}>
                  {hairstyle.name}
                </h2>
                <p className="text-sm font-body leading-relaxed mb-6" style={{ color: "#7A6152" }}>
                  {hairstyle.description}
                </p>

                {/* Meta grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  {[
                    { label: "Best For",  value: hairstyle.bestFor.split(",")[0] },
                    { label: "Hair Type", value: hairstyle.suitableHair || "All Types" },
                  ].map((m) => (
                    <div key={m.label} className="rounded-lg p-3" style={{ background: "#FAF7F0" }}>
                      <p className="text-[10px] font-body uppercase tracking-wider mb-1" style={{ color: "#9CA3AF" }}>{m.label}</p>
                      <p className="text-sm font-semibold font-body leading-tight" style={{ color: "#2B2118" }}>{m.value}</p>
                    </div>
                  ))}

                  {/* Time */}
                  <div className="rounded-lg p-3 flex items-start gap-2" style={{ background: "#FAF7F0" }}>
                    <Clock className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#C6A15B" }} />
                    <div>
                      <p className="text-[10px] font-body uppercase tracking-wider mb-0.5" style={{ color: "#9CA3AF" }}>Time</p>
                      <p className="text-sm font-semibold font-body" style={{ color: "#2B2118" }}>{hairstyle.time}</p>
                    </div>
                  </div>

                  {/* Maintenance */}
                  <div className="rounded-lg p-3" style={{ background: "#FAF7F0" }}>
                    <p className="text-[10px] font-body uppercase tracking-wider mb-1.5" style={{ color: "#9CA3AF" }}>Upkeep</p>
                    {badge && (
                      <span
                        className="text-xs font-semibold font-body px-2.5 py-0.5 rounded-full"
                        style={{ background: badge.bg, color: badge.text }}
                      >
                        {hairstyle.maintenance}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price + CTA */}
              <div className="mt-6 pt-5 border-t flex items-center justify-between" style={{ borderColor: "#E8D8C3" }}>
                {hairstyle.price && (
                  <div>
                    <p className="text-[10px] font-body uppercase tracking-wider" style={{ color: "#9CA3AF" }}>Starting at</p>
                    <p className="font-heading font-bold text-xl mt-0.5" style={{ color: "#5C3A2E" }}>
                      ₹{hairstyle.price}
                    </p>
                  </div>
                )}
                <button
                  onClick={() => { onClose(); document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" }); }}
                  className="btn text-xs"
                >
                  Book This Style
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

