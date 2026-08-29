import { useDataContext } from "@/contexts/DataContext";
import type { BridalCategory } from "@/lib/fetchData";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  Bath,
  Brush,
  ChevronDown,
  CircleDot,
  Droplets,
  Flower,
  Leaf,
  Scissors,
  Sparkles,
  Sun,
  X,
  ArrowRight,
} from "lucide-react";
import type { ComponentType, CSSProperties } from "react";
import { useEffect, useRef, useState } from "react";

type IconType = ComponentType<{ className?: string; style?: CSSProperties }>;

const CATEGORY_ICONS: Record<string, IconType> = {
  "hair-styling": Scissors,
  makeup: Brush,
  "body-care": Bath,
  beauty: Sparkles,
  bleach: Leaf,
  detan: Sun,
  cleanup: Droplets,
  threading: CircleDot,
  waxing: Flower,
};

function catCount(cat: BridalCategory): number {
  const services = cat.services?.length ?? 0;
  const subRows = cat.subCategories?.reduce((n, s) => n + s.rows.length, 0) ?? 0;
  return services + subRows;
}

/* ── Compact menu table (bleach / waxing) ── */
function MenuTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="overflow-hidden" style={{ border: "1px solid #E8D8C3", borderRadius: 8 }}>
      <div className="flex items-center px-4 sm:px-5 py-2.5" style={{ background: "#F8F1E7" }}>
        {headers.map((h, i) => (
          <span
            key={h}
            className={`font-body text-[10px] font-semibold uppercase tracking-wider ${
              i === 0 ? "flex-1 text-left" : "w-24 sm:w-28 text-right"
            } ${i > 0 ? "pl-3" : ""}`}
            style={{ color: "#5C3A2E" }}
          >
            {h}
          </span>
        ))}
      </div>
      {rows.map((r, ri) => (
        <div
          key={ri}
          className="flex items-center px-4 sm:px-5 py-3"
          style={{ background: ri % 2 === 0 ? "#fff" : "#FDFAF6", borderTop: "1px solid #F3F4F6" }}
        >
          {r.map((cell, ci) => (
            <span
              key={ci}
              className={`font-body text-sm ${
                ci === 0 ? "flex-1 text-left" : "w-24 sm:w-28 text-right font-semibold"
              } ${ci > 0 ? "pl-3" : ""}`}
              style={{ color: ci === 0 ? "#2B2118" : "#5C3A2E" }}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ── Active category content in modal ── */
function CategoryContent({ cat }: { cat: BridalCategory }) {
  const Icon = CATEGORY_ICONS[cat.id] ?? Sparkles;
  const count = catCount(cat);
  const subs = cat.subCategories ?? [];
  const hasTwoPrices = subs.some((s) => s.rows.some((r) => r.price2));

  return (
    <div>
      {/* Category header */}
      <div className="flex items-center gap-3 mb-6">
        <span
          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: "rgba(198,161,91,0.15)" }}
        >
          <Icon className="w-5 h-5" style={{ color: "#C6A15B" }} />
        </span>
        <div>
          <h3 className="font-heading font-semibold text-xl leading-tight" style={{ color: "#3E2723" }}>
            {cat.title}
          </h3>
          <p className="font-body text-xs mt-0.5" style={{ color: "#9A6B52" }}>
            {count} {count === 1 ? "service" : "services"}
          </p>
        </div>
      </div>

      {/* Standard services */}
      {cat.services.length > 0 && (
        <div className="mb-7">
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] mb-2" style={{ color: "#9CA3AF" }}>
            Services &amp; Rates
          </p>
          <div>
            {cat.services.map((s, i) => (
              <div
                key={s.name}
                className="flex items-baseline gap-3 py-2.5"
                style={{ borderTop: i > 0 ? "1px solid #F3F4F6" : "none" }}
              >
                <span className="text-[15px] font-body leading-snug" style={{ color: "#2B2118" }}>
                  {s.name}
                </span>
                <span className="flex-1 border-b border-dotted" style={{ borderColor: "#E8D8C3" }} />
                <span className="text-[15px] font-semibold font-body whitespace-nowrap" style={{ color: "#5C3A2E" }}>
                  {s.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-category grids */}
      {subs.length > 0 && (
        <div>
          <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] mb-3" style={{ color: "#9CA3AF" }}>
            Services &amp; Rates
          </p>
          {hasTwoPrices ? (
            <MenuTable
              headers={["Service", "Honey Wax", "Rice Wax"]}
              rows={subs.flatMap((s) => s.rows).map((r) => [r.label, r.price, r.price2 ?? "—"])}
            />
          ) : (
            (() => {
              const brands = Array.from(new Set(subs.flatMap((s) => s.rows.map((r) => r.label))));
              return (
                <MenuTable
                  headers={["Area", ...brands]}
                  rows={subs.map((s) => [
                    s.title,
                    ...brands.map((b) => s.rows.find((r) => r.label === b)?.price ?? "—"),
                  ])}
                />
              );
            })()
          )}
        </div>
      )}
    </div>
  );
}

/* ── Bridal Services Modal ── */
function BridalModal({ onClose }: { onClose: () => void }) {
  const { bridalCategories } = useDataContext();
  const [activeId, setActiveId] = useState(bridalCategories[0].id);
  const active = bridalCategories.find((c) => c.id === activeId)!;

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="fixed inset-0 z-200 flex items-end sm:items-center justify-center p-0 sm:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(43,33,24,0.65)" }} />

      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 40, opacity: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full sm:max-w-4xl h-[94vh] sm:h-[88vh] rounded-t-2xl sm:rounded-2xl overflow-hidden flex flex-col shadow-2xl"
        style={{ border: "1px solid #E8D8C3" }}
      >
        {/* Header */}
        <div className="shrink-0 px-6 sm:px-8 py-5" style={{ background: "#3E2723" }}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-body text-[10px] font-semibold uppercase tracking-[0.24em] mb-1" style={{ color: "#C6A15B" }}>
                Bridal Studio
              </p>
              <h2 className="font-heading font-semibold text-white text-2xl leading-tight">Bridal Collection</h2>
              <p className="font-body text-xs mt-1" style={{ color: "rgba(255,255,255,0.6)" }}>
                Complete service menu with indicative rates
              </p>
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-9 h-9 rounded-full flex items-center justify-center transition-colors shrink-0"
              style={{ background: "rgba(255,255,255,0.1)" }}
            >
              <X className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* Mobile tab strip */}
        <div className="sm:hidden flex gap-2 overflow-x-auto no-scrollbar px-4 py-3 border-b shrink-0" style={{ background: "#F8F1E7", borderColor: "#E8D8C3" }}>
          {bridalCategories.map((cat) => {
            const isActive = activeId === cat.id;
            const Icon = CATEGORY_ICONS[cat.id] ?? Sparkles;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveId(cat.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-full font-body text-xs font-medium whitespace-nowrap transition-colors"
                style={{
                  background: isActive ? "#5C3A2E" : "#fff",
                  color: isActive ? "#fff" : "#7A6152",
                  boxShadow: isActive ? "0 6px 14px rgba(62,39,35,0.25)" : "inset 0 0 0 1px #E8D8C3",
                }}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: isActive ? "#C6A15B" : "#9A6B52" }} />
                {cat.title}
              </button>
            );
          })}
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar — desktop category nav */}
          <aside className="hidden sm:flex flex-col w-56 border-r overflow-y-auto no-scrollbar p-3 gap-1 shrink-0" style={{ background: "#F8F1E7", borderColor: "#E8D8C3" }}>
            {bridalCategories.map((cat) => {
              const isActive = activeId === cat.id;
              const Icon = CATEGORY_ICONS[cat.id] ?? Sparkles;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveId(cat.id)}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all hover:bg-white/70"
                  style={{
                    background: isActive ? "#5C3A2E" : "transparent",
                    boxShadow: isActive ? "0 8px 20px rgba(62,39,35,0.2)" : "none",
                  }}
                >
                  <Icon
                    className="w-4 h-4 shrink-0"
                    style={{ color: isActive ? "#C6A15B" : "#9A6B52" }}
                  />
                  <span
                    className="flex-1 font-body text-sm font-medium"
                    style={{ color: isActive ? "#fff" : "#3E2723" }}
                  >
                    {cat.title}
                  </span>
                  <span
                    className="font-body text-[10px] font-semibold"
                    style={{ color: isActive ? "rgba(255,255,255,0.55)" : "#9A6B52" }}
                  >
                    {catCount(cat)}
                  </span>
                </button>
              );
            })}
          </aside>

          {/* Content */}
          <div className="flex-1 overflow-y-auto no-scrollbar">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.2 }}
                className="p-6 sm:p-8"
              >
                <CategoryContent cat={active} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 px-6 sm:px-8 py-4 border-t" style={{ background: "#F8F1E7", borderColor: "#E8D8C3" }}>
          <p className="font-body text-xs text-center" style={{ color: "#9CA3AF" }}>
            Prices are indicative. Book a consultation for a personalised quote.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Bridal Section ── */
export default function Bridal() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section id="bridal" className="section relative overflow-hidden" style={{ background: "#3E2723" }}>
        {/* Subtle decorative background watermark */}
        <div
          className="absolute -right-16 -bottom-20 font-heading font-bold select-none pointer-events-none opacity-5 leading-none hidden lg:block"
          style={{ fontSize: "clamp(10rem, 20vw, 18rem)", color: "#F8F1E7" }}
        >
          BRIDAL
        </div>

        <div className="wrap relative z-10">
          <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Visual Area with asymmetric portrait + floating card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div
                className="relative overflow-hidden rounded-2xl shadow-2xl"
                style={{ aspectRatio: "4/5", background: "#5C3A2E" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=900&q=85"
                  alt="Bridal styling at Poongothai Family Salon"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(43,33,24,0.5) 0%, transparent 60%)" }}
                />
              </div>

              {/* Floating studio badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="absolute -bottom-6 -right-6 px-7 py-5 rounded-xl shadow-2xl hidden sm:block backdrop-blur-md"
                style={{ background: "rgba(92,58,46,0.92)", border: "1px solid rgba(198,161,91,0.3)" }}
              >
                <p className="font-heading font-bold text-xl text-white leading-tight">Dream Bridal</p>
                <p className="font-body text-[10px] tracking-[0.25em] uppercase mt-1" style={{ color: "#C6A15B" }}>
                  Complete Studio
                </p>
              </motion.div>
            </motion.div>

            {/* Content Area */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px" style={{ background: "#C6A15B" }} />
                <span className="label" style={{ color: "#C6A15B" }}>Bridal Studio</span>
              </div>

              <h2
                className="font-heading font-bold text-white mb-6"
                style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
              >
                BEAUTY,
                <br />
                <span style={{ color: "#C6A15B" }}>MADE</span> PERSONAL.
              </h2>

              <p
                className="font-body text-sm leading-[1.9] mb-10 max-w-lg"
                style={{ color: "rgba(248,241,231,0.72)" }}
              >
                From bespoke hair and luxury makeup to intricate saree draping and full pre-bridal rituals — our dedicated artists craft every detail so you look and feel unforgettable on your most cherished day.
              </p>

              {/* Service highlights in an editorial grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-12">
                {[
                  "HD & Airbrush Makeup",
                  "Bridal Hair & Updos",
                  "Reception & Sangeet Looks",
                  "Precision Saree Draping",
                  "Pre-Bridal Glow Packages",
                  "Complete Body Care & Spa",
                ].map((s) => (
                  <div
                    key={s}
                    className="flex items-center gap-3 py-2.5 px-3.5 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#C6A15B" }} />
                    <span className="font-body text-xs font-medium text-white/90">{s}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setModalOpen(true)}
                className="group flex items-center gap-3 font-body font-medium text-white transition-all duration-300"
                style={{
                  background: "#5C3A2E",
                  border: "1px solid rgba(198,161,91,0.4)",
                  padding: "15px 32px",
                  fontSize: "0.82rem",
                  letterSpacing: "0.1em",
                  borderRadius: 3,
                }}
              >
                Explore Bridal Collection
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" style={{ color: "#C6A15B" }} />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {modalOpen && <BridalModal onClose={() => setModalOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
