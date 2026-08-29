import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useDataContext } from "@/contexts/DataContext";

export default function Owner() {
  const { owner: ownerData } = useDataContext();
  const ref   = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="about" className="section" style={{ background: "#F0E6D8" }}>
      <div className="wrap">
        <div ref={ref} className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative overflow-hidden bg-[#ddd8d0]"
              style={{ aspectRatio: "4/5", borderRadius: "10px" }}
            >
              <img
                src={ownerData.photo}
                alt={ownerData.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)" }} />
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="label mb-3">Meet the Expert</p>
            <h2 className="h-lg mb-1" style={{ color: "#3E2723" }}>{ownerData.name}</h2>
            <p className="text-sm font-body mb-5" style={{ color: "#C6A15B" }}>{ownerData.title}</p>
            <div className="rule rule-left mb-7" />

            <p className="text-sm font-body leading-[1.9] mb-9 max-w-md" style={{ color: "#7A6152" }}>
              {ownerData.description}
            </p>

            {/* Stats */}
            <div className="flex gap-10 mb-10">
              {[
                { val: ownerData.experience, lbl: "Experience" },
                { val: "12K+",               lbl: "Happy Clients" },
                { val: "4.6★",               lbl: "Google Rating" },
              ].map((s) => (
                <div key={s.lbl}>
                  <p className="font-heading font-bold text-3xl" style={{ color: "#3E2723" }}>{s.val}</p>
                  <p className="text-xs font-body mt-1 tracking-wide uppercase" style={{ color: "#9CA3AF" }}>{s.lbl}</p>
                </div>
              ))}
            </div>

            {/* Awards */}
            <div className="space-y-2.5">
              {ownerData.awards.slice(0, 3).map((a) => (
                <div key={a} className="flex items-start gap-3 text-sm font-body" style={{ color: "#7A6152" }}>
                  <span className="mt-1 shrink-0 text-xs" style={{ color: "#C6A15B" }}>—</span>
                  {a}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

