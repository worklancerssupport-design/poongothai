import { useRef, type ComponentType, type CSSProperties } from "react";
import { motion, useInView } from "framer-motion";
import { Scissors, Gem, ShieldCheck, UserCheck, Zap, Wallet } from "lucide-react";

type Feature = {
  num: string;
  icon: ComponentType<{ className?: string; style?: CSSProperties }>;
  title: string;
  body: string;
};

const features: Feature[] = [
  { num: "01", icon: Scissors,    title: "Expert Stylists",      body: "Trained at leading academies across India and abroad." },
  { num: "02", icon: Gem,         title: "Premium Products",     body: "L'Oréal, Kerastase & Schwarzkopf — exclusively." },
  { num: "03", icon: ShieldCheck, title: "100% Hygiene",         body: "Sterilised tools and a clinically clean environment." },
  { num: "04", icon: UserCheck,   title: "Personalised Service", body: "Every visit begins with a dedicated consultation." },
  { num: "05", icon: Zap,         title: "Modern Equipment",     body: "State-of-the-art styling tools for superior results." },
  { num: "06", icon: Wallet,      title: "Affordable Luxury",    body: "World-class quality at transparent, honest pricing." },
];

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="section" style={{ background: "#0F172A" }}>
      <div className="wrap">
        {/* Header — the question leads */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16 lg:mb-20"
        >
          <div>
            <p className="label mb-5">Why Choose Poongothai</p>
            <h2
              className="font-heading font-bold leading-none tracking-tight"
              style={{ color: "#fff", fontSize: "clamp(2.75rem, 6.5vw, 5rem)" }}
            >
              Why Poongothai?
            </h2>
            <div className="mt-7 h-[3px] w-16 rounded-full" style={{ background: "#C6A15B" }} />
          </div>
          <p
            className="max-w-md font-body text-base leading-relaxed lg:text-right"
            style={{ color: "rgba(203,213,225,0.7)" }}
          >
            Because the details you never notice are the ones we sweat.
            Six promises, held to a single standard —{" "}
            <span className="font-medium" style={{ color: "#fff" }}>yours.</span>
          </p>
        </motion.div>

        {/* Feature grid — title first, numbers whisper-quiet */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group relative overflow-hidden rounded-2xl border p-7 transition-all duration-300 hover:-translate-y-1"
              style={{
                background: "rgba(255,255,255,0.035)",
                borderColor: "rgba(255,255,255,0.09)",
              }}
            >
              {/* Gold hairline accent on hover */}
              <span
                className="absolute left-0 top-0 h-[2px] w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: "#C6A15B" }}
              />

              <div className="mb-6 flex items-center justify-between">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl border"
                  style={{ borderColor: "rgba(198,161,91,0.35)", background: "rgba(198,161,91,0.08)" }}
                >
                  <f.icon className="h-5 w-5" style={{ color: "#C6A15B" }} />
                </span>
                <span
                  className="font-body text-[0.68rem] font-semibold tracking-[0.3em]"
                  style={{ color: "rgba(226,232,240,0.35)" }}
                >
                  {f.num}
                </span>
              </div>

              <h3 className="font-heading text-xl font-semibold mb-2" style={{ color: "#fff" }}>
                {f.title}
              </h3>
              <p className="font-body text-sm leading-relaxed" style={{ color: "rgba(203,213,225,0.66)" }}>
                {f.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

