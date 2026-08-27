import { motion } from "framer-motion";
import type { Hairstyle } from "@/data/hairstyles";

interface Props {
  hairstyle: Hairstyle;
  index?: number;
  onClick: (h: Hairstyle) => void;
}

export default function HairstyleCard({ hairstyle, index = 0, onClick }: Props) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: (index % 4) * 0.06 }}
      onClick={() => onClick(hairstyle)}
      className="group text-left w-full focus:outline-none"
    >
      {/* Image container */}
      <div
        className="relative overflow-hidden bg-[#E8E4DE]"
        style={{ aspectRatio: "3/4", borderRadius: "8px" }}
      >
        <img
          src={hairstyle.image}
          alt={hairstyle.name}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Hover overlay */}
        <div className="absolute inset-0 transition-all duration-400"
          style={{ background: "rgba(0,0,0,0)" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(35,78,112,0.35)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0)")}
        >
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-white text-[10px] font-body font-medium tracking-[0.2em] uppercase border border-white/60 px-4 py-2">
              View Details
            </span>
          </div>
        </div>

        {/* Price badge */}
        {hairstyle.price && (
          <div
            className="absolute top-3 right-3 text-white text-[10px] font-body font-bold px-2.5 py-1 rounded-full"
            style={{ background: "rgba(35,78,112,0.85)" }}
          >
            {hairstyle.price}
          </div>
        )}
      </div>

      {/* Label */}
      <div className="mt-3.5 px-0.5">
        <h3 className="font-heading font-semibold text-base leading-tight" style={{ color: "#2B2118" }}>
          {hairstyle.name}
        </h3>
        <p className="text-xs font-body mt-1" style={{ color: "#9CA3AF" }}>
          {hairstyle.tags[0]}
          {hairstyle.maintenance ? ` · ${hairstyle.maintenance}` : ""}
        </p>
      </div>
    </motion.button>
  );
}

