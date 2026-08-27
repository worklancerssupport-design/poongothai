import { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { ChevronDown } from "lucide-react";
import HairstyleCard from "./HairstyleCard";
import HairstyleLightbox from "./HairstyleLightbox";
import { mensHairstyles, womensHairstyles, type Hairstyle } from "@/data/hairstyles";

const MEN_TAGS   = ["All", "Fade", "Mullet", "Short", "Long", "Crop", "Styled"];
const WOMEN_TAGS = ["All", "Layer", "Short", "Long", "Wedding", "Styled"];
type Gender = "men" | "women";

export default function Hairstyles() {
  const ref    = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const [gender,  setGender]  = useState<Gender>("men");
  const [filter,  setFilter]  = useState("All");
  const [showAll, setShowAll] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [active, setActive] = useState<Hairstyle | null>(null);

  const tags       = gender === "men" ? MEN_TAGS : WOMEN_TAGS;
  const dataSource = gender === "men" ? mensHairstyles : womensHairstyles;
  const filtered   = filter === "All" ? dataSource : dataSource.filter((h) => h.tags.includes(filter));
  const visible    = showAll ? filtered : filtered.slice(0, 8);

  return (
    <>
      <section id="hairstyles" className="section" style={{ background: "#FFF9F2" }}>
        <div className="wrap">

          {/* ── Editorial Heading ── */}
          <div ref={ref} className="relative mb-20">
            {/* Oversized background text */}
            <div
              className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center pointer-events-none select-none leading-none font-heading font-bold hidden lg:block"
              style={{ fontSize: "clamp(6rem, 14vw, 11rem)", color: "#F0E6D8", letterSpacing: "-0.04em", zIndex: 0 }}
            >
              HAIRSTYLES
            </div>

            <div className="relative z-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-8">
              {/* Text block */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-6 h-px" style={{ background: "#C6A15B" }} />
                  <span className="label">Collection</span>
                </div>
                <h2
                  className="font-heading font-bold leading-[0.95]"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 3.8rem)", color: "#3E2723", letterSpacing: "-0.03em" }}
                >
                  THE CUT<br />
                  <span style={{ color: "#5C3A2E" }}>MAKES</span> THE LOOK.
                </h2>
              </motion.div>

              {/* Gender toggle */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7, delay: 0.15 }}
                className="flex flex-col gap-2 self-start sm:self-auto"
              >
                <span className="label text-right hidden sm:block" style={{ color: "#9A6B52" }}>Switch</span>
                <div
                  className="inline-flex border p-1"
                  style={{ borderColor: "#E8D8C3", borderRadius: 2, background: "#fff" }}
                >
                  {(["men", "women"] as Gender[]).map((g) => (
                    <button
                      key={g}
                      onClick={() => { setGender(g); setFilter("All"); }}
                      className="px-6 py-2 font-body font-medium tracking-wide transition-all duration-250"
                      style={{
                        fontSize: "0.75rem",
                        borderRadius: 1,
                        letterSpacing: "0.1em",
                        background: gender === g ? "#5C3A2E" : "transparent",
                        color: gender === g ? "#fff" : "#7A6152",
                      }}
                    >
                      {g === "men" ? "MEN'S" : "WOMEN'S"}
                    </button>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ── Filter tags ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex flex-wrap gap-2 mb-14"
          >
            {tags.map((tag) => (
              <button
                key={tag}
                onClick={() => setFilter(tag)}
                className="font-body font-medium tracking-wider transition-all duration-200"
                style={{
                  fontSize: "0.7rem",
                  padding: "7px 18px",
                  border: "1px solid",
                  borderRadius: 1,
                  letterSpacing: "0.12em",
                  background: filter === tag ? "#5C3A2E" : "transparent",
                  color: filter === tag ? "#fff" : "#7A6152",
                  borderColor: filter === tag ? "#5C3A2E" : "#E8D8C3",
                }}
              >
                {tag}
              </button>
            ))}
          </motion.div>

          {/* ── Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-7">
            {visible.map((h, i) => (
              <HairstyleCard key={h.id} hairstyle={h} index={i} onClick={setActive} />
            ))}
          </div>

          {/* ── Show more ── */}
          {filtered.length > 8 && (
            <div className="mt-14 flex justify-center">
              <button
                ref={btnRef}
                onClick={() => {
                  if (showAll) {
                    setShowAll(false);
                    requestAnimationFrame(() => btnRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
                  } else {
                    setShowAll(true);
                  }
                }}
                className="btn-ghost flex items-center gap-2"
                aria-expanded={showAll}
              >
                {showAll ? "Show less" : "Show more styles"}
                <ChevronDown className="w-4 h-4" style={{ transform: showAll ? "rotate(180deg)" : "none", transition: "transform 0.3s ease" }} />
              </button>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-center py-16 font-body text-sm" style={{ color: "#9CA3AF" }}>
              No styles found for this filter.
            </p>
          )}
        </div>
      </section>

      <HairstyleLightbox hairstyle={active} all={visible} onClose={() => setActive(null)} onNavigate={setActive} />
    </>
  );
}
