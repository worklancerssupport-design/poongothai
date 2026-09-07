import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { Search, X, ArrowRight, Sparkles, IndianRupee, Scissors, ArrowUpRight } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";

const fmt = (n: number) => n.toLocaleString("en-IN");

interface SearchResultItem {
  name: string;
  categoryTitle: string;
  gender: "men" | "women" | "kids";
  price: number | string;
  oldPrice?: number | string;
  offer?: string;
}

export default function Services() {
  const { services: servicesData, mens, womens, kids } = useDataContext();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  // Main Section Tab: "men" | "women"
  const [activeGender, setActiveGender] = useState<"men" | "women">("men");
  const [selectedCatId, setSelectedCatId] = useState<string>("men-haircut");
  const [searchQuery, setSearchQuery] = useState("");

  // Categories for current gender
  const currentCategories = useMemo(() => {
    return servicesData.filter((c) => c.gender === activeGender);
  }, [activeGender]);

  // Selected category object
  const activeCategory = useMemo(() => {
    return currentCategories.find((c) => c.id === selectedCatId) || currentCategories[0] || servicesData[0];
  }, [currentCategories, selectedCatId]);

  // Global search through all services data
  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];

    const results: SearchResultItem[] = [];

    servicesData.forEach((cat) => {
      // Standard services
      cat.services.forEach((s) => {
        if (
          s.name.toLowerCase().includes(query) ||
          cat.title.toLowerCase().includes(query) ||
          (s.offer && s.offer.toLowerCase().includes(query))
        ) {
          results.push({
            name: s.name,
            categoryTitle: cat.title,
            gender: cat.gender,
            price: s.price,
            oldPrice: s.oldPrice,
            offer: s.offer,
          });
        }
      });

      // Subcategories (waxing / bleach grids)
      if (cat.subCategories) {
        cat.subCategories.forEach((sub) => {
          sub.rows.forEach((r) => {
            if (
              r.label.toLowerCase().includes(query) ||
              sub.title.toLowerCase().includes(query) ||
              cat.title.toLowerCase().includes(query)
            ) {
              results.push({
                name: `${sub.title} — ${r.label}`,
                categoryTitle: cat.title,
                gender: cat.gender,
                price: r.price,
                oldPrice: undefined,
              });
            }
          });
        });
      }
    });

    [...mens, ...womens, ...kids].forEach((h) => {
      if (h.name.toLowerCase().includes(query)) {
        results.push({
          name: h.name,
          categoryTitle: "HAIRSTYLE",
          gender: h.gender as "men" | "women" | "kids",
          price: h.price || "",
          oldPrice: h.oldPrice,
        });
      }
    });

    return results;
  }, [searchQuery]);

  const handleGenderSwitch = (gender: "men" | "women") => {
    setActiveGender(gender);
    const firstCat = servicesData.find((c) => c.gender === gender);
    if (firstCat) setSelectedCatId(firstCat.id);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const isSearching = searchQuery.trim().length > 0;

  return (
    <section id="services" className="section relative overflow-hidden" style={{ background: "#F8F1E7" }}>
      {/* Background Studio Watermark */}
      <div
        className="absolute right-0 top-10 font-heading font-bold select-none pointer-events-none opacity-5 leading-none hidden lg:block"
        style={{ fontSize: "clamp(10rem, 18vw, 16rem)", color: "#3E2723" }}
      >
        STUDIO
      </div>

      <div className="wrap relative z-10">
        {/* ── Editorial Section Header ── */}
        <div ref={ref} className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-[#C6A15B]" />
              <span className="label text-[#9A6B52]">SERVICES / 02</span>
            </div>
            <h2
              className="font-heading font-bold text-[#3E2723]"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 4rem)", letterSpacing: "-0.03em", lineHeight: 1.05 }}
            >
              YOUR CARE.
              <br />
              <span style={{ color: "#5C3A2E" }}>YOUR</span> WAY.
            </h2>
            <p className="font-body text-sm text-[#7A6152] mt-4 max-w-md leading-relaxed">
              Explore professional hair, beauty and grooming services designed for every occasion.
            </p>
          </motion.div>

          {/* ── Premium Floating Search Input ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="w-full lg:w-96 relative"
          >
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-[#9A6B52] absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any service..."
                className="w-full pl-11 pr-10 py-3.5 rounded-full text-xs font-body border border-[#E8D8C3] bg-white text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] focus:ring-2 focus:ring-[#5C3A2E]/10 shadow-sm transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 w-6 h-6 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#3E2723] hover:bg-[#F0E6D8]"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── Focused Main Service Navigation (Men's & Women's) ── */}
        {!isSearching && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-12">
            {/* 01 Men's Grooming */}
            <button
              onClick={() => handleGenderSwitch("men")}
              className={`group flex flex-col justify-between p-6 sm:p-7 rounded-2xl text-left border transition-all duration-300 ${
                activeGender === "men"
                  ? "bg-[#3E2723] text-white border-[#3E2723] shadow-xl"
                  : "bg-white text-[#3E2723] border-[#E8D8C3] hover:border-[#9A6B52] hover:bg-[#FFF9F2] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <span
                  className={`text-xs font-body font-bold tracking-[0.24em] ${
                    activeGender === "men" ? "text-[#C6A15B]" : "text-[#9A6B52]"
                  }`}
                >
                  01
                </span>
                <ArrowRight
                  className={`w-5 h-5 transition-transform group-hover:translate-x-1.5 ${
                    activeGender === "men" ? "text-[#C6A15B]" : "text-[#9A6B52]"
                  }`}
                />
              </div>
              <span className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide">
                MEN&apos;S GROOMING
              </span>
            </button>

            {/* 02 Women's Beauty */}
            <button
              onClick={() => handleGenderSwitch("women")}
              className={`group flex flex-col justify-between p-6 sm:p-7 rounded-2xl text-left border transition-all duration-300 ${
                activeGender === "women"
                  ? "bg-[#3E2723] text-white border-[#3E2723] shadow-xl"
                  : "bg-white text-[#3E2723] border-[#E8D8C3] hover:border-[#9A6B52] hover:bg-[#FFF9F2] shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between w-full mb-4">
                <span
                  className={`text-xs font-body font-bold tracking-[0.24em] ${
                    activeGender === "women" ? "text-[#C6A15B]" : "text-[#9A6B52]"
                  }`}
                >
                  02
                </span>
                <ArrowRight
                  className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:translate-x-1.5 ${
                    activeGender === "women" ? "text-[#C6A15B]" : "text-[#9A6B52]"
                  }`}
                />
              </div>
              <span className="font-heading font-bold text-xl sm:text-2xl uppercase tracking-wide">
                WOMEN&apos;S BEAUTY
              </span>
            </button>
          </div>
        )}

        {/* ── MODE 1: GLOBAL SEARCH RESULTS VIEW ── */}
        {isSearching ? (
          <div className="bg-white rounded-2xl border border-[#E8D8C3] p-6 sm:p-10 shadow-md">
            <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#E8D8C3]">
              <div>
                <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A6B52]">
                  SEARCH RESULTS
                </p>
                <h3 className="font-heading font-bold text-2xl text-[#3E2723] mt-1">
                  Matching &ldquo;{searchQuery}&rdquo;
                </h3>
              </div>
              <span className="font-body text-xs text-[#9CA3AF]">
                {searchResults.length} service{searchResults.length === 1 ? "" : "s"} found
              </span>
            </div>

            {searchResults.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-heading text-lg text-[#5C3A2E] mb-1">No services found</p>
                <p className="font-body text-xs text-[#9CA3AF]">
                  Try searching for haircuts, facials, colouring, waxing, or spa...
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#E8D8C3]/50">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors hover:bg-[#FFF9F2] px-4 -mx-4 rounded-lg"
                  >
                    <div>
                      <h4 className="font-heading font-semibold text-base text-[#2B2118] group-hover:text-[#5C3A2E] transition-colors">
                        {item.name}
                      </h4>
                      <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#9A6B52] mt-0.5">
                        {item.categoryTitle} • {item.gender.toUpperCase()}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      {item.offer && (
                        <span className="text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5 rounded-full bg-[#FDF3E3] text-[#B4821F]">
                          {item.offer}
                        </span>
                      )}
                      {item.oldPrice && (
                        <span className="text-xs line-through font-body text-[#9CA3AF]">
                          ₹{typeof item.oldPrice === "number" ? fmt(item.oldPrice) : item.oldPrice}
                        </span>
                      )}
                      <span className="font-heading font-bold text-lg text-[#5C3A2E]">
                        {typeof item.price === "number" ? `₹${fmt(item.price)}` : item.price}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* ── MODE 2: INTERACTIVE "SERVICE STUDIO" EXPLORER ── */
          <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
            {/* ── LEFT COLUMN: Vertical Category Navigation (4 cols) ── */}
            <div
              className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#E8D8C3] p-5 sm:p-7 flex flex-col"
              style={{ background: "#FDFAF6" }}
            >
              <div className="mb-6 flex items-center justify-between">
                <span className="font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#9A6B52]">
                  {activeGender === "men" ? "MEN'S DIRECTORY" : "WOMEN'S DIRECTORY"}
                </span>
                <span className="font-body text-xs text-[#9CA3AF]">
                  {currentCategories.length} categories
                </span>
              </div>

              {/* Category Links List */}
              <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
                {currentCategories.map((cat, idx) => {
                  const isSelected = cat.id === activeCategory.id;
                  const numStr = (idx + 1).toString().padStart(2, "0");

                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCatId(cat.id)}
                      className={`group flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-xl text-left transition-all duration-200 shrink-0 lg:shrink ${
                        isSelected
                          ? "bg-[#3E2723] text-white shadow-sm"
                          : "text-[#7A6152] hover:bg-[#F0E6D8] hover:text-[#3E2723]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`font-body font-semibold text-xs transition-colors ${
                            isSelected ? "text-[#C6A15B]" : "text-[#9CA3AF] group-hover:text-[#5C3A2E]"
                          }`}
                        >
                          {numStr}
                        </span>
                        <span
                          className={`font-heading font-semibold text-sm sm:text-base tracking-wide uppercase transition-colors ${
                            isSelected ? "text-white" : "text-[#2B2118]"
                          }`}
                        >
                          {cat.title}
                        </span>
                      </div>

                      <span
                        className={`text-[11px] font-body font-medium hidden lg:inline ${
                          isSelected ? "text-white/60" : "text-[#9CA3AF]"
                        }`}
                      >
                        {cat.services.length > 0
                          ? `${cat.services.length} styles`
                          : `${cat.subCategories?.length || 0} types`}
                      </span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* ── RIGHT COLUMN: Dynamic Service List (8 cols) ── */}
            <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col">
              {/* Category Active Header */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="flex flex-col flex-1"
                >
                  <div className="pb-6 mb-6 border-b border-[#E8D8C3]">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                      <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6B52]">
                        {activeCategory.gender.toUpperCase()} COLLECTION
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#3E2723]">
                      {activeCategory.title}
                    </h3>
                    <p className="font-body text-xs text-[#7A6152] mt-1.5 leading-relaxed max-w-xl">
                      {activeCategory.description}
                    </p>
                  </div>

                  {/* Standard Services List Rows */}
                  {activeCategory.services.length > 0 && (
                    <div className="space-y-1">
                      {activeCategory.services.map((service, index) => (
                        <div
                          key={service.name}
                          className="group relative flex items-center justify-between py-4 px-4 sm:px-5 rounded-xl border border-transparent transition-all duration-200 hover:bg-[#FFF9F2] hover:border-[#E8D8C3]/80 hover:pl-6"
                        >
                          {/* Left: Service Name */}
                          <div className="flex-1 min-w-0 pr-4">
                            <h4 className="font-heading font-semibold text-base sm:text-lg text-[#2B2118] group-hover:text-[#5C3A2E] transition-colors leading-snug">
                              {service.name}
                            </h4>
                            {service.offer && (
                              <span className="inline-block mt-1 text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDF3E3] text-[#B4821F]">
                                {service.offer}
                              </span>
                            )}
                          </div>

                          {/* Right: Service Price */}
                          <div className="text-right shrink-0 flex items-center gap-3">
                            {service.oldPrice && (
                              <span className="text-xs line-through font-body text-[#9CA3AF]">
                                ₹{fmt(service.oldPrice)}
                              </span>
                            )}
                            <div className="font-heading font-bold text-lg sm:text-xl text-[#5C3A2E] leading-none flex items-center">
                              <IndianRupee className="w-4 h-4 -mr-0.5" />
                              {fmt(service.price)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Subcategories (Waxing / Bleach structured multi-rate view) */}
                  {activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
                    <div className="space-y-6">
                      {activeCategory.subCategories.map((sub, sIdx) => (
                        <div key={sub.title} className="p-5 rounded-xl border border-[#E8D8C3] bg-[#FDFAF6]">
                          <h4 className="font-heading font-bold text-base text-[#3E2723] mb-3">
                            {sub.title}
                          </h4>
                          <div className="divide-y divide-[#E8D8C3]/60">
                            {sub.rows.map((row) => (
                              <div key={row.label} className="py-2.5 flex items-center justify-between text-xs font-body">
                                <span className="text-[#2B2118] font-medium">{row.label}</span>
                                <div className="flex items-center gap-3 font-semibold text-[#5C3A2E]">
                                  <span>{row.price}</span>
                                  {row.price2 && (
                                    <span className="text-[#9A6B52] border-l border-[#E8D8C3] pl-3">
                                      Rice: {row.price2}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Studio Note */}
                  <div className="mt-auto pt-8 border-t border-[#E8D8C3]/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body text-[#9CA3AF]">
                    <span>* Prices are indicative based on hair length &amp; custom styling.</span>
                    <button
                      onClick={() => scrollTo("contact")}
                      className="font-semibold text-[#5C3A2E] hover:underline"
                    >
                      Book Consultation →
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
