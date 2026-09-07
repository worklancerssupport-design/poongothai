import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Search } from "lucide-react";
import { useDataContext } from "@/contexts/DataContext";
import type { Hairstyle } from "@/lib/fetchData";

interface HairstyleCatalogueProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuHairstyle {
  id: string;
  name: string;
  gender: "MEN" | "WOMEN" | "KIDS";
  category: string;
  price: string;
  oldPrice?: string;
}

function toMenuItems(hairstyles: Hairstyle[], gender: "MEN" | "WOMEN" | "KIDS"): MenuHairstyle[] {
  return hairstyles.map((h) => ({
    id: h.id,
    name: h.name,
    gender,
    category: "HAIR CUT",
    price: h.price ? `₹${h.price}` : "Price on consultation",
    oldPrice: h.oldPrice ? `₹${h.oldPrice}` : undefined,
  }));
}

export default function HairstyleCatalogue({ isOpen, onClose }: HairstyleCatalogueProps) {
  const { mens, womens, kids } = useDataContext();
  const [activeTab, setActiveTab] = useState<"MEN" | "WOMEN" | "KIDS">("MEN");
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const menItems = useMemo(() => toMenuItems(mens, "MEN"), [mens]);
  const womenItems = useMemo(() => toMenuItems(womens, "WOMEN"), [womens]);
  const kidsItems = useMemo(() => toMenuItems(kids, "KIDS"), [kids]);
  const allHairstyles = useMemo(() => [...menItems, ...womenItems, ...kidsItems], [menItems, womenItems, kidsItems]);

  const currentCategoryHairstyles = useMemo(() => {
    if (activeTab === "MEN") return menItems;
    if (activeTab === "WOMEN") return womenItems;
    return kidsItems;
  }, [activeTab, menItems, womenItems, kidsItems]);

  const isSearchActive = searchQuery.trim().length > 0;

  const displayList = useMemo(() => {
    if (!isSearchActive) return currentCategoryHairstyles;
    const query = searchQuery.toLowerCase();
    return allHairstyles.filter((h) => h.name.toLowerCase().includes(query));
  }, [isSearchActive, searchQuery, currentCategoryHairstyles, allHairstyles]);

  const handleTabChange = (tab: "MEN" | "WOMEN" | "KIDS") => {
    setActiveTab(tab);
    setSearchQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 md:p-10 bg-black/60 backdrop-blur-md overflow-hidden"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-[#FAF7F0] rounded-2xl shadow-[0_24px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-[#E5DFCF] p-3 sm:p-5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute inset-2 border-4 border-double border-[#C6A15B]/30 rounded-xl pointer-events-none z-10" />
            <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#C6A15B]/40 pointer-events-none z-10" />
            <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#C6A15B]/40 pointer-events-none z-10" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#C6A15B]/40 pointer-events-none z-10" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#C6A15B]/40 pointer-events-none z-10" />

            <div className="relative flex flex-col flex-1 overflow-hidden z-20">
              
              {/* Header */}
              <div className="relative pt-6 pb-4 px-6 text-center flex flex-col items-center select-none shrink-0">
                <button
                  onClick={onClose}
                  className="absolute top-2 right-2 p-2 rounded-full text-[#7A6152] hover:text-[#5C3A2E] hover:bg-[#5C3A2E]/5 transition-colors focus:outline-none focus:ring-2 focus:ring-[#5C3A2E]"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="mb-2 shrink-0 flex flex-col items-center">
                  <div className="font-heading font-bold text-xs tracking-[0.25em] text-[#C6A15B]">
                    POONGOTHAI
                  </div>
                  <div className="font-body text-[9px] tracking-[0.3em] text-[#7A6152] uppercase mt-0.5">
                    FAMILY SALON
                  </div>
                </div>

                <h2 className="font-heading text-2xl sm:text-3xl font-bold tracking-widest text-[#5C3A2E] uppercase">
                  Hairstyle Menu
                </h2>

                <div className="flex items-center gap-3 my-1">
                  <div className="w-8 sm:w-16 h-[1px] bg-[#C6A15B]/40" />
                  <span className="text-[#C6A15B] text-xs">✦</span>
                  <div className="w-8 sm:w-16 h-[1px] bg-[#C6A15B]/40" />
                </div>

                <p className="font-body text-xs italic text-[#7A6152] tracking-wide">
                  Find your perfect style
                </p>
              </div>

              {/* Search Bar */}
              <div className="px-6 sm:px-12 py-2 flex justify-center shrink-0">
                <div className="relative w-full max-w-md">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-[#7A6152]">
                    <Search className="w-4 h-4" />
                  </span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any hairstyle..."
                    className="w-full pl-9 pr-8 py-2 text-sm bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] focus:ring-1 focus:ring-[#5C3A2E] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#9CA3AF] hover:text-[#2B2118]"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Tab Navigation */}
              <div className="px-6 sm:px-12 pb-3 flex flex-col items-center shrink-0">
                <div className="inline-flex rounded-lg p-0.5 bg-[#FAF7F0] border border-[#E5DFCF] w-full max-w-md">
                  {(["MEN", "WOMEN", "KIDS"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => handleTabChange(tab)}
                      className={`flex-1 py-1.5 text-xs font-body font-bold tracking-widest rounded-md uppercase transition-all duration-300 ${
                        activeTab === tab
                          ? "bg-[#5C3A2E] text-white shadow-sm"
                          : "text-[#5C3A2E] hover:bg-[#5C3A2E]/5"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {isSearchActive && (
                  <div className="mt-3 text-xs font-body text-[#C6A15B] font-medium tracking-wide">
                    {displayList.length === 0
                      ? "No hairstyles found"
                      : `${displayList.length} hairstyle${displayList.length === 1 ? "" : "s"} found`}
                  </div>
                )}
              </div>

              {/* Menu Area */}
              <div className="flex-1 overflow-y-auto px-6 sm:px-12 py-4 bg-white/50 backdrop-blur-[2px] rounded-lg border border-[#E5DFCF]/20 mx-4 sm:mx-8 mb-4 scrollbar-thin">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab + (isSearchActive ? "search:" + searchQuery : "browse")}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-full"
                  >
                    {displayList.length === 0 ? (
                      <div className="text-center py-16 flex flex-col items-center justify-center">
                        <p className="text-base font-body font-semibold text-[#5C3A2E] mb-1">
                          No hairstyles found
                        </p>
                        <p className="text-xs font-body text-[#7A6152]">
                          Try another hairstyle name
                        </p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                        {displayList.map((h, index) => (
                          <motion.div
                            key={h.id}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: Math.min(index * 0.015, 0.2),
                              duration: 0.2,
                            }}
                            className="py-4 border-b border-[#E5DFCF]/50 last:border-b-0 md:[&:nth-last-child(-n+2)]:border-b-0 flex flex-col justify-center"
                          >
                            <div className="flex justify-between items-baseline gap-4">
                              <h3 className="font-heading font-bold text-sm tracking-wide text-[#5C3A2E] uppercase">
                                {h.name}
                              </h3>
                              <span className="font-heading font-semibold text-sm text-[#C6A15B] shrink-0">
                                {h.oldPrice || h.price}
                              </span>
                            </div>
                            <div className="text-[10px] font-body font-semibold tracking-wider text-[#9CA3AF] mt-1">
                              {h.gender} • {h.category}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
