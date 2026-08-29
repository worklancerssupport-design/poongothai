import { useState, useRef } from "react";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Check, X, ArrowRight, IndianRupee, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";
import type { Package } from "@/lib/fetchData";

const fmt = (n: number) => n.toLocaleString("en-IN");

/* ── Package Details Modal ── */
function PackageModal({ pkg, onClose }: { pkg: Package | null; onClose: () => void }) {
  if (!pkg) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-200 flex items-center justify-center p-4 sm:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
      >
        <div className="absolute inset-0 backdrop-blur-sm" style={{ background: "rgba(43,33,24,0.65)" }} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative bg-white w-full max-w-lg overflow-hidden shadow-2xl rounded-2xl flex flex-col"
          style={{ border: "1px solid #E8D8C3" }}
        >
          {/* Modal Header */}
          <div className="px-6 sm:px-8 pt-7 pb-5 flex items-start justify-between gap-4 border-b border-[#E8D8C3]" style={{ background: "#FFF9F2" }}>
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                <span className="font-body text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9A6B52]">
                  PACKAGE OFFER
                </span>
              </div>
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#3E2723] leading-tight">
                {pkg.title}
              </h3>
              {pkg.description && (
                <p className="font-body text-xs text-[#7A6152] mt-1.5 leading-relaxed">
                  {pkg.description}
                </p>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0 bg-[#F8F1E7] hover:bg-[#E8D8C3]"
              aria-label="Close modal"
            >
              <X className="w-4 h-4 text-[#5C3A2E]" />
            </button>
          </div>

          {/* Included Services List */}
          <div className="p-6 sm:p-8 overflow-y-auto max-h-[55vh]">
            <p className="font-body text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9A6B52] mb-4">
              Complete Included Services ({pkg.includes.length})
            </p>
            <div className="space-y-3">
              {pkg.includes.map((service) => (
                <div
                  key={service}
                  className="flex items-center gap-3.5 p-3 rounded-lg border border-[#E8D8C3]/60 bg-[#FDFAF6]"
                >
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#5C3A2E] text-white">
                    <Check className="w-3 h-3 stroke-[2.5]" />
                  </div>
                  <span className="font-body text-sm font-medium text-[#2B2118]">
                    {service}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Pricing Footer */}
          <div className="px-6 sm:px-8 py-5 border-t border-[#E8D8C3] bg-[#FFF9F2] flex items-center justify-between">
            <div>
              <span className="block text-xs line-through font-body text-[#9CA3AF]">
                Old Price: ₹{fmt(pkg.oldPrice)}
              </span>
              <div className="flex items-center gap-1 font-heading font-bold text-2xl sm:text-3xl text-[#5C3A2E] leading-none mt-0.5">
                <IndianRupee className="w-5 h-5" />
                {fmt(pkg.newPrice)}
              </div>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-md font-body font-semibold text-xs tracking-wider uppercase transition-colors bg-[#3E2723] text-[#F8F1E7] hover:bg-[#5C3A2E]"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Individual Package Offer Card ── */
function PackageCard({
  pkg,
  isFeatured,
  delay,
  onOpenDetails,
}: {
  pkg: Package;
  isFeatured: boolean;
  delay: number;
  onOpenDetails: (pkg: Package) => void;
}) {
  // Generate a clean preview of included services
  const servicesPreview = pkg.includes.slice(0, 4).join(" • ");
  const hasMore = pkg.includes.length > 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{ duration: 0.5, delay }}
      className={`group relative flex flex-col justify-between rounded-2xl transition-all duration-300 p-6 sm:p-7 hover:-translate-y-1.5 ${
        isFeatured
          ? "bg-[#FFF9F2] border-2 border-[#9A6B52] shadow-[0_12px_36px_rgba(92,58,46,0.12)]"
          : "bg-white border border-[#E8D8C3] shadow-[0_4px_20px_rgba(92,58,46,0.05)] hover:shadow-[0_12px_32px_rgba(92,58,46,0.1)]"
      }`}
      style={{ minHeight: "340px" }}
    >
      {/* Subtle Featured Accent Badge */}
      {isFeatured && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#5C3A2E] text-white font-body text-[10px] font-semibold uppercase tracking-widest shadow-sm">
          Featured Package
        </div>
      )}

      {/* Card Header & Title */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6B52]">
            SPECIAL PACKAGE
          </span>
          <span className="text-xs font-body text-[#9CA3AF]">
            {pkg.includes.length} Services
          </span>
        </div>

        <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#3E2723] leading-snug mb-3">
          {pkg.title}
        </h3>

        {/* Included Services Summary Preview */}
        <p className="font-body text-xs text-[#7A6152] leading-relaxed line-clamp-2 mb-2">
          {servicesPreview}
          {hasMore ? " and more..." : ""}
        </p>

        {pkg.description && (
          <p className="font-body text-[11px] text-[#9CA3AF] italic leading-normal mb-5 line-clamp-1">
            &ldquo;{pkg.description}&rdquo;
          </p>
        )}
      </div>

      {/* Pricing & CTA Section */}
      <div className="pt-5 mt-auto border-t border-[#E8D8C3]/70 flex flex-col gap-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-xs font-body text-[#9CA3AF] line-through leading-tight">
              ₹{fmt(pkg.oldPrice)}
            </span>
            <div className="flex items-center font-heading font-bold text-2xl sm:text-3xl text-[#5C3A2E] leading-none mt-1">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 -mr-0.5" />
              {fmt(pkg.newPrice)}
            </div>
          </div>

          <button
            onClick={() => onOpenDetails(pkg)}
            className="inline-flex items-center gap-1.5 text-xs font-body font-semibold tracking-wider text-[#5C3A2E] group-hover:text-[#3E2723] transition-colors py-1"
          >
            View Details
            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <button
          onClick={() => onOpenDetails(pkg)}
          className={`w-full py-2.5 px-4 rounded-md font-body font-semibold text-xs tracking-wider uppercase transition-all duration-200 text-center ${
            isFeatured
              ? "bg-[#5C3A2E] text-white hover:bg-[#3E2723]"
              : "bg-[#FAF7F0] text-[#5C3A2E] border border-[#E8D8C3] hover:bg-[#5C3A2E] hover:text-white"
          }`}
        >
          VIEW PACKAGE DETAILS
        </button>
      </div>
    </motion.div>
  );
}

/* ── Main Package Offers Section ── */
export default function Packages() {
  const { packages: packagesData } = useDataContext();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [selectedGender, setSelectedGender] = useState<"all" | "men" | "women">("all");
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredPackages = packagesData.filter((p) => {
    if (selectedGender === "all") return true;
    if (selectedGender === "men") return p.gender === "men";
    return p.gender !== "men";
  });

  // Initially show only 6 packages
  const visiblePackages = showAll ? filteredPackages : filteredPackages.slice(0, 6);

  const handleTabChange = (tabKey: "all" | "men" | "women") => {
    setSelectedGender(tabKey);
    setShowAll(false);
  };

  return (
    <section id="packages" className="section relative" style={{ background: "#F8F1E7" }}>
      <div className="wrap">
        {/* Section Header */}
        <div ref={ref} className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#C6A15B]" />
              <span className="label text-[#9A6B52]">Exclusive Bundles</span>
            </div>
            <h2
              className="font-heading font-bold text-[#3E2723]"
              style={{ fontSize: "clamp(2.2rem, 5vw, 3.6rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              PACKAGE OFFERS
            </h2>
            <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
              Complete care, thoughtfully bundled.
            </p>
          </motion.div>

          {/* Gender Filter Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex self-start md:self-auto p-1 rounded-lg border border-[#E8D8C3] bg-white shadow-sm"
          >
            {[
              { key: "all", label: "All Packages" },
              { key: "men", label: "Men" },
              { key: "women", label: "Women & Bridal" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => handleTabChange(tab.key as any)}
                className="px-4 sm:px-5 py-2 font-body font-medium text-xs tracking-wider rounded-md transition-all duration-200 capitalize"
                style={{
                  background: selectedGender === tab.key ? "#5C3A2E" : "transparent",
                  color: selectedGender === tab.key ? "#FFFFFF" : "#7A6152",
                }}
              >
                {tab.label}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Responsive Grid: 3 columns Desktop, 2 Tablet, 1 Mobile */}
        <AnimatePresence mode="wait">
          <motion.div
            key={`${selectedGender}-${showAll}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
          >
            {visiblePackages.map((pkg, index) => {
              // Highlight the first prominent package subtly as featured
              const isFeatured = index === 0 && selectedGender === "all";

              return (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  isFeatured={isFeatured}
                  delay={index * 0.05}
                  onOpenDetails={setSelectedPackage}
                />
              );
            })}
          </motion.div>
        </AnimatePresence>

        {/* ── SHOW MORE / SHOW LESS BUTTON ── */}
        {filteredPackages.length > 6 && (
          <div className="mt-14 flex justify-center">
            <button
              onClick={() => {
                if (showAll) {
                  setShowAll(false);
                  requestAnimationFrame(() => {
                    document.getElementById("packages")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  });
                } else {
                  setShowAll(true);
                }
              }}
              className="group inline-flex items-center gap-3 px-8 py-3.5 rounded-full font-body font-semibold text-xs tracking-wider uppercase transition-all duration-300 shadow-sm"
              style={{
                background: "#3E2723",
                color: "#F8F1E7",
                border: "1px solid rgba(198,161,91,0.3)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#5C3A2E";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(62,39,35,0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#3E2723";
                e.currentTarget.style.boxShadow = "none";
              }}
              aria-expanded={showAll}
            >
              {showAll ? (
                <>
                  SHOW LESS
                  <ChevronUp className="w-4 h-4 text-[#C6A15B] transition-transform group-hover:-translate-y-0.5" />
                </>
              ) : (
                <>
                  SHOW MORE PACKAGES
                  <ChevronDown className="w-4 h-4 text-[#C6A15B] transition-transform group-hover:translate-y-0.5" />
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Package Details Modal */}
      <PackageModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
    </section>
  );
}
