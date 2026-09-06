import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RefreshCw, Save, RotateCcw, IndianRupee, Search, Pencil, X, Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import EditServices from "./EditServices";
import type { ServiceCategory, ServiceItem } from "@/lib/fetchData";

function InlineEdit({
  value,
  onSave,
  placeholder,
  className,
  inputClassName,
}: {
  value: string;
  onSave: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      setDraft(value);
      requestAnimationFrame(() => inputRef.current?.select());
    }
  }, [editing, value]);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  const cancel = () => {
    setEditing(false);
    setDraft(value);
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (!editing) {
      e.stopPropagation();
      setEditing(true);
    }
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") { e.preventDefault(); commit(); }
          else if (e.key === "Escape") { e.preventDefault(); cancel(); }
        }}
        onClick={(e) => e.stopPropagation()}
        placeholder={placeholder}
        className={inputClassName}
        autoFocus
      />
    );
  }

  return (
    <span
      onDoubleClick={handleClick}
      onTouchStart={(e) => {
        const touch = (e as React.TouchEvent).touches[0];
        const target = e.currentTarget;
        const startX = touch.clientX;
        const startY = touch.clientY;
        let triggered = false;
        const onEnd = (ev: TouchEvent) => {
          const t = ev.changedTouches[0];
          if (!triggered && Math.abs(t.clientX - startX) < 8 && Math.abs(t.clientY - startY) < 8) {
            triggered = true;
            handleClick(e as unknown as React.MouseEvent);
          }
          target.removeEventListener("touchend", onEnd);
        };
        target.addEventListener("touchend", onEnd);
      }}
      title="Double-click to edit"
      className={className}
    >
      {value || <span className="opacity-40">{placeholder || "Empty"}</span>}
    </span>
  );
}

/* ── Main editor ── */
export default function EditServicesEditor() {
  return (
    <section className="section relative overflow-hidden" style={{ background: "#F8F1E7" }}>
      <div className="wrap relative z-10">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#C6A15B]" />
            <span className="label text-[#9A6B52]">SERVICES / 02</span>
          </div>
          <h2
            className="font-heading font-bold text-[#3E2723]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            EDIT YOUR
            <br />
            <span style={{ color: "#5C3A2E" }}>SERVICES.</span>
          </h2>
          <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
            Browse by gender and category. Double-click any service name or price to edit inline.
          </p>
        </div>

        <EditServices>
          {(props) => <ServicesExplorer {...props} />}
        </EditServices>
      </div>
    </section>
  );
}

/* ── Explorer component (valid hook context) ── */
function ServicesExplorer({
  editData,
  loading,
  saving,
  error,
  hasChanges,
  refresh,
  updateCategory,
  updateService,
  addService,
  removeService,
  updateSubRow,
  addSubRow,
  removeSubRow,
  save,
  discard,
}: {
  editData: ServiceCategory[] | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  hasChanges: boolean;
  refresh: () => void;
  updateCategory: (catIndex: number, updates: Partial<ServiceCategory>) => void;
  updateService: (catIndex: number, svcIndex: number, updates: Partial<ServiceItem>) => void;
  addService: (catIndex: number, service: ServiceItem) => void;
  removeService: (catIndex: number, svcIndex: number) => void;
  updateSubRow: (catIndex: number, subIndex: number, rowIndex: number, updates: Partial<{ label: string; price: string; price2: string; type: string }>) => void;
  addSubRow: (catIndex: number, subIndex: number, row: { label: string; price: string; price2?: string; type?: string }) => void;
  removeSubRow: (catIndex: number, subIndex: number, rowIndex: number) => void;
  save: () => Promise<boolean>;
  discard: () => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGender, setActiveGender] = useState<"men" | "women">("men");
  const [selectedCatId, setSelectedCatId] = useState<string | null>(null);
  const prevGenderRef = useRef(activeGender);

  const isSearching = searchQuery.trim().length > 0;

  const currentCategories = useMemo(() => {
    if (!editData) return [];
    return editData.filter((cat) => cat.gender === activeGender);
  }, [editData, activeGender]);

  const effectiveCatId = useMemo(() => {
    if (selectedCatId && currentCategories.some((c) => c.id === selectedCatId)) {
      return selectedCatId;
    }
    return currentCategories[0]?.id || null;
  }, [selectedCatId, currentCategories]);

  const activeCategory = useMemo(() => {
    if (!effectiveCatId || !editData) return null;
    return editData.find((c) => c.id === effectiveCatId) || null;
  }, [effectiveCatId, editData]);

  const activeCatIndex = useMemo(() => {
    if (!activeCategory || !editData) return -1;
    return editData.indexOf(activeCategory);
  }, [activeCategory, editData]);

  // Auto-select first category when gender changes
  useEffect(() => {
    if (prevGenderRef.current !== activeGender) {
      prevGenderRef.current = activeGender;
      setSelectedCatId(currentCategories[0]?.id || null);
    }
  }, [activeGender, currentCategories]);

  // Search results - flatten all services across all categories
  const searchResults = useMemo(() => {
    if (!isSearching || !editData) return [];
    const q = searchQuery.trim().toLowerCase();
    const results: { catIndex: number; svcIndex: number; service: ServiceItem; categoryName: string; gender: string }[] = [];

    editData.forEach((cat, catIdx) => {
      cat.services.forEach((svc, svcIdx) => {
        if (
          svc.name.toLowerCase().includes(q) ||
          cat.title.toLowerCase().includes(q) ||
          (svc.oldPrice && String(svc.oldPrice).includes(q)) ||
          (svc.offer && svc.offer.toLowerCase().includes(q))
        ) {
          results.push({
            catIndex: catIdx,
            svcIndex: svcIdx,
            service: svc,
            categoryName: cat.title,
            gender: cat.gender,
          });
        }
      });
    });

    return results;
  }, [searchQuery, editData, isSearching]);

  const handleGenderSwitch = (g: "men" | "women") => {
    setActiveGender(g);
    setSelectedCatId(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-5 h-5 text-[#C6A15B] animate-spin" />
        <span className="ml-3 font-body text-sm text-[#7A6152]">Loading services…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-body text-sm">
        {error}
      </div>
    );
  }

  if (!editData) return null;

  return (
    <div>
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A6B52] pointer-events-none" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any service..."
              className="pl-9 pr-8 py-2 text-xs font-body bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] transition-colors w-44 sm:w-56"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center text-[#9CA3AF] hover:text-[#3E2723]"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <span className="font-body text-[10px] text-[#9A6B52] tracking-wide">
            {isSearching ? `${searchResults.length} results` : `${currentCategories.length} categories`}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={refresh}
            disabled={saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-[#5C3A2E] border border-[#E5DFCF] rounded-lg hover:bg-[#5C3A2E]/5 transition-colors disabled:opacity-40"
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
          <button
            onClick={discard}
            disabled={!hasChanges || saving}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-[#7A6152] border border-[#E5DFCF] rounded-lg hover:bg-[#7A6152]/5 transition-colors disabled:opacity-40"
          >
            <RotateCcw className="w-3 h-3" />
            Discard
          </button>
          <button
            onClick={save}
            disabled={!hasChanges || saving}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-white bg-[#5C3A2E] rounded-lg hover:bg-[#3E2723] transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Save className="w-3 h-3" />
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      {/* Status banner */}
      <AnimatePresence>
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-4 px-3 py-2 rounded-lg bg-[#FDF3E3] border border-[#C6A15B]/30 flex items-center gap-2"
          >
            <Pencil className="w-3 h-3 text-[#B4821F]" />
            <span className="font-body text-[11px] text-[#B4821F]">You have unsaved changes</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isSearching ? (
        <SearchResultsView
          results={searchResults}
          editData={editData}
          updateService={updateService}
          removeService={removeService}
        />
      ) : (
        <BrowseView
          activeGender={activeGender}
          onGenderSwitch={handleGenderSwitch}
          currentCategories={currentCategories}
          activeCategory={activeCategory}
          activeCatIndex={activeCatIndex}
          onSelectCategory={setSelectedCatId}
          editData={editData}
          updateCategory={updateCategory}
          updateService={updateService}
          addService={addService}
          removeService={removeService}
          updateSubRow={updateSubRow}
          addSubRow={addSubRow}
          removeSubRow={removeSubRow}
        />
      )}
    </div>
  );
}

/* ── Browse Mode: Two-column Studio Explorer ── */
function BrowseView({
  activeGender,
  onGenderSwitch,
  currentCategories,
  activeCategory,
  activeCatIndex,
  onSelectCategory,
  editData,
  updateCategory,
  updateService,
  addService,
  removeService,
  updateSubRow,
  addSubRow,
  removeSubRow,
}: {
  activeGender: "men" | "women";
  onGenderSwitch: (g: "men" | "women") => void;
  currentCategories: ServiceCategory[];
  activeCategory: ServiceCategory | null;
  activeCatIndex: number;
  onSelectCategory: (id: string) => void;
  editData: ServiceCategory[];
  updateCategory: (catIndex: number, updates: Partial<ServiceCategory>) => void;
  updateService: (catIndex: number, svcIndex: number, updates: Partial<ServiceItem>) => void;
  addService: (catIndex: number, service: ServiceItem) => void;
  removeService: (catIndex: number, svcIndex: number) => void;
  updateSubRow: (catIndex: number, subIndex: number, rowIndex: number, updates: Partial<{ label: string; price: string; price2: string; type: string }>) => void;
  addSubRow: (catIndex: number, subIndex: number, row: { label: string; price: string; price2?: string; type?: string }) => void;
  removeSubRow: (catIndex: number, subIndex: number, rowIndex: number) => void;
}) {
  const genders = ["men", "women"] as const;

  const addServiceToCategory = () => {
    if (activeCatIndex < 0) return;
    addService(activeCatIndex, { name: "New Service", price: 0 });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-md overflow-hidden grid grid-cols-1 lg:grid-cols-12">
      {/* LEFT COLUMN */}
      <div className="lg:col-span-4 border-b lg:border-b-0 lg:border-r border-[#E8D8C3] p-5 sm:p-7 flex flex-col" style={{ background: "#FDFAF6" }}>
        <div className="inline-flex rounded-lg p-0.5 bg-[#FAF7F0] border border-[#E5DFCF] mb-6 w-full">
          {genders.map((g) => (
            <button
              key={g}
              onClick={() => onGenderSwitch(g)}
              className={`flex-1 py-1.5 text-[10px] font-body font-bold tracking-widest rounded-md uppercase transition-all duration-300 ${
                activeGender === g ? "bg-[#5C3A2E] text-white shadow-sm" : "text-[#5C3A2E] hover:bg-[#5C3A2E]/5"
              }`}
            >
              {g === "men" ? "MEN" : "WOMEN"}
            </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <span className="font-body text-[10px] font-bold uppercase tracking-[0.24em] text-[#9A6B52]">
            {activeGender === "men" ? "MEN'S SERVICES" : "WOMEN'S SERVICES"}
          </span>
          <span className="font-body text-xs text-[#9CA3AF]">{currentCategories.length} categories</span>
        </div>

        <nav className="flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible no-scrollbar pb-2 lg:pb-0">
          {currentCategories.map((cat, idx) => {
            const isSelected = cat.id === activeCategory?.id;
            const svcCount = cat.services.length;
            const subCount = (cat.subCategories || []).reduce((n, s) => n + s.rows.length, 0);
            const totalCount = svcCount + subCount;
            const numStr = (idx + 1).toString().padStart(2, "0");

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`group flex items-center justify-between px-4 py-3 sm:py-3.5 rounded-xl text-left transition-all duration-200 shrink-0 lg:shrink ${
                  isSelected ? "bg-[#3E2723] text-white shadow-sm" : "text-[#7A6152] hover:bg-[#F0E6D8] hover:text-[#3E2723]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`font-body font-semibold text-xs transition-colors ${
                    isSelected ? "text-[#C6A15B]" : "text-[#9CA3AF] group-hover:text-[#5C3A2E]"
                  }`}>{numStr}</span>
                  <span className={`font-heading font-semibold text-sm sm:text-base tracking-wide transition-colors ${
                    isSelected ? "text-white" : "text-[#2B2118]"
                  }`}>{cat.title}</span>
                </div>
                <span className={`text-[11px] font-body font-medium hidden lg:inline ${
                  isSelected ? "text-white/60" : "text-[#9CA3AF]"
                }`}>{totalCount} {totalCount === 1 ? "item" : "items"}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* RIGHT COLUMN */}
      <div className="lg:col-span-8 p-6 sm:p-10 flex flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory?.id || "empty"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex flex-col flex-1"
          >
            {activeCategory ? (
              <>
                {/* Category header */}
                <div className="pb-6 mb-6 border-b border-[#E8D8C3]">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C6A15B]" />
                    <span className="font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6B52]">
                      {activeGender === "men" ? "MEN" : "WOMEN"} COLLECTION
                    </span>
                  </div>
                  <h3 className="font-heading font-bold text-2xl sm:text-3xl text-[#3E2723]">
                    <InlineEdit
                      value={activeCategory.title}
                      onSave={(v) => updateCategory(activeCatIndex, { title: v })}
                      placeholder="Category title"
                      className="cursor-pointer"
                      inputClassName="w-full font-heading font-bold text-2xl sm:text-3xl text-[#3E2723] border border-[#5C3A2E] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#5C3A2E]/10"
                    />
                  </h3>
                  {activeCategory.description && (
                    <p className="font-body text-xs text-[#7A6152] mt-1.5 leading-relaxed max-w-xl">
                      <InlineEdit
                        value={activeCategory.description}
                        onSave={(v) => updateCategory(activeCatIndex, { description: v })}
                        placeholder="Category description"
                        className="cursor-pointer"
                        inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                      />
                    </p>
                  )}
                  <p className="font-body text-xs text-[#9CA3AF] mt-1">
                    {activeCategory.services.length} services{activeCategory.subCategories ? `, ${(activeCategory.subCategories || []).reduce((n, s) => n + s.rows.length, 0)} sub-items` : ""}
                  </p>
                </div>

                {/* Services list */}
                {activeCategory.services.length > 0 && (
                  <div className="space-y-1 mb-6">
                    {activeCategory.services.map((svc, svcIdx) => (
                      <motion.div
                        key={`${svc.name}-${svcIdx}`}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.15, delay: Math.min(svcIdx * 0.01, 0.1) }}
                        className="group relative flex items-center justify-between py-4 px-4 sm:px-5 rounded-xl border border-transparent transition-all duration-200 hover:bg-[#FFF9F2] hover:border-[#E8D8C3]/80 hover:pl-6"
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <InlineEdit
                            value={svc.name}
                            onSave={(v) => updateService(activeCatIndex, svcIdx, { name: v })}
                            placeholder="Service name"
                            className="block font-heading font-semibold text-base sm:text-lg text-[#2B2118] group-hover:text-[#5C3A2E] transition-colors leading-snug cursor-pointer"
                            inputClassName="w-full font-heading font-semibold text-base sm:text-lg text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#5C3A2E]/10"
                          />
                          {svc.offer && (
                            <span className="inline-block mt-1 text-[10px] font-body font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FDF3E3] text-[#B4821F]">
                              {svc.offer}
                            </span>
                          )}
                        </div>

                        <div className="text-right shrink-0 flex items-center gap-3">
                          {svc.oldPrice && svc.oldPrice > 0 && (
                            <InlineEdit
                              value={String(svc.oldPrice)}
                              onSave={(v) => updateService(activeCatIndex, svcIdx, { oldPrice: Number(v) || 0 })}
                              placeholder="Old"
                              className="text-xs line-through font-body text-[#9CA3AF] cursor-pointer"
                              inputClassName="w-16 text-xs line-through font-body text-[#9CA3AF] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none text-right"
                            />
                          )}
                          <div className="font-heading font-bold text-lg sm:text-xl text-[#5C3A2E] leading-none flex items-center">
                            <IndianRupee className="w-4 h-4 -mr-0.5 pointer-events-none" />
                            <InlineEdit
                              value={String(svc.price)}
                              onSave={(v) => updateService(activeCatIndex, svcIdx, { price: Number(v) || 0 })}
                              placeholder="0"
                              className="cursor-pointer hover:text-[#3E2723] transition-colors"
                              inputClassName="w-20 font-heading font-bold text-lg text-[#5C3A2E] border border-[#5C3A2E] rounded px-2 py-1 outline-none text-right"
                            />
                          </div>
                          <button
                            onClick={() => removeService(activeCatIndex, svcIdx)}
                            className="ml-1 p-1.5 rounded-md text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                            aria-label="Remove service"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Subcategories */}
                {activeCategory.subCategories && activeCategory.subCategories.length > 0 && (
                  <div className="space-y-4 mb-6">
                    {activeCategory.subCategories.map((sub, subIdx) => (
                      <SubCategorySection
                        key={`${sub.title}-${subIdx}`}
                        sub={sub}
                        subIndex={subIdx}
                        catIndex={activeCatIndex}
                        updateSubRow={updateSubRow}
                        addSubRow={addSubRow}
                        removeSubRow={removeSubRow}
                      />
                    ))}
                  </div>
                )}

                {/* Add service button */}
                <div className="mt-auto pt-6 border-t border-[#E8D8C3]/60">
                  <button
                    onClick={addServiceToCategory}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 font-body text-xs font-semibold tracking-widest uppercase text-[#5C3A2E] border border-[#E5DFCF] rounded-xl hover:bg-[#5C3A2E]/5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Service to {activeCategory.title}
                  </button>
                </div>
              </>
            ) : (
              <div className="py-16 text-center">
                <p className="font-heading text-base text-[#5C3A2E] mb-1">No categories found</p>
                <p className="font-body text-xs text-[#9CA3AF]">Switch gender or check your data</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ── SubCategory Section ── */
function SubCategorySection({
  sub,
  subIndex,
  catIndex,
  updateSubRow,
  addSubRow,
  removeSubRow,
}: {
  sub: { title: string; rows: { label: string; price: string; price2?: string; type?: string }[] };
  subIndex: number;
  catIndex: number;
  updateSubRow: (catIndex: number, subIndex: number, rowIndex: number, updates: Partial<{ label: string; price: string; price2: string; type: string }>) => void;
  addSubRow: (catIndex: number, subIndex: number, row: { label: string; price: string; price2?: string; type?: string }) => void;
  removeSubRow: (catIndex: number, subIndex: number, rowIndex: number) => void;
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-xl border border-[#E8D8C3] overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-3 bg-[#FDFAF6] hover:bg-[#F5EDE0] transition-colors"
      >
        <div className="flex items-center gap-2">
          {expanded ? <ChevronDown className="w-3.5 h-3.5 text-[#7A6152]" /> : <ChevronRight className="w-3.5 h-3.5 text-[#7A6152]" />}
          <span className="font-heading font-semibold text-sm text-[#3E2723]">{sub.title || "Subcategory"}</span>
          <span className="font-body text-[10px] text-[#9CA3AF]">({sub.rows.length} rows)</span>
        </div>
      </button>

      {expanded && (
        <div className="p-4 space-y-1">
          {sub.rows.map((row, rowIdx) => (
            <div
              key={`${row.label}-${rowIdx}`}
              className="group flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#FFF9F2] transition-colors"
            >
              <div className="flex-1 min-w-0">
                <InlineEdit
                  value={row.label}
                  onSave={(v) => updateSubRow(catIndex, subIndex, rowIdx, { label: v })}
                  placeholder="Label"
                  className="font-body text-sm text-[#2B2118] cursor-pointer"
                  inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="font-heading font-semibold text-sm text-[#5C3A2E] flex items-center">
                  <IndianRupee className="w-3 h-3 -mr-0.5 pointer-events-none" />
                  <InlineEdit
                    value={row.price}
                    onSave={(v) => updateSubRow(catIndex, subIndex, rowIdx, { price: v })}
                    placeholder="₹0"
                    className="cursor-pointer"
                    inputClassName="w-16 font-heading font-semibold text-sm text-[#5C3A2E] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none text-right"
                  />
                </div>
                {row.price2 && (
                  <div className="font-heading font-semibold text-sm text-[#7A6152] flex items-center">
                    <IndianRupee className="w-3 h-3 -mr-0.5 pointer-events-none" />
                    <InlineEdit
                      value={row.price2}
                      onSave={(v) => updateSubRow(catIndex, subIndex, rowIdx, { price2: v })}
                      placeholder="₹0"
                      className="cursor-pointer"
                      inputClassName="w-16 font-heading font-semibold text-sm text-[#7A6152] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none text-right"
                    />
                  </div>
                )}
                <button
                  onClick={() => removeSubRow(catIndex, subIndex, rowIdx)}
                  className="p-1 rounded text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove row"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={() => addSubRow(catIndex, subIndex, { label: "New Item", price: "₹0" })}
            className="w-full mt-2 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-[#5C3A2E] border border-dashed border-[#E5DFCF] rounded-lg hover:bg-[#5C3A2E]/5 transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-3 h-3" />
            Add Row
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Search Results View ── */
function SearchResultsView({
  results,
  editData,
  updateService,
  removeService,
}: {
  results: { catIndex: number; svcIndex: number; service: ServiceItem; categoryName: string; gender: string }[];
  editData: ServiceCategory[];
  updateService: (catIndex: number, svcIndex: number, updates: Partial<ServiceItem>) => void;
  removeService: (catIndex: number, svcIndex: number) => void;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8D8C3] shadow-md overflow-hidden">
      <div className="p-6 sm:p-8 border-b border-[#E8D8C3]">
        <p className="font-body text-[11px] font-semibold uppercase tracking-[0.2em] text-[#9A6B52]">SEARCH RESULTS</p>
        <h3 className="font-heading font-bold text-2xl text-[#3E2723] mt-1">
          {results.length} {results.length === 1 ? "service" : "services"} found
        </h3>
      </div>

      {results.length === 0 ? (
        <div className="py-16 text-center">
          <p className="font-heading text-lg text-[#5C3A2E] mb-1">No services found</p>
          <p className="font-body text-xs text-[#9CA3AF]">Try searching for haircuts, facials, waxing, etc.</p>
        </div>
      ) : (
        <div className="max-h-[600px] overflow-y-auto divide-y divide-[#E8D8C3]/50">
          {results.map(({ catIndex, svcIndex, service, categoryName, gender }, idx) => (
            <div
              key={`${catIndex}-${svcIndex}-${idx}`}
              className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition-colors hover:bg-[#FFF9F2] px-5"
            >
              <div>
                <InlineEdit
                  value={service.name}
                  onSave={(v) => updateService(catIndex, svcIndex, { name: v })}
                  placeholder="Service name"
                  className="font-heading font-semibold text-base text-[#2B2118] group-hover:text-[#5C3A2E] transition-colors cursor-pointer"
                  inputClassName="w-full font-heading font-semibold text-base text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                />
                <p className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#9A6B52] mt-0.5">
                  {categoryName} • {gender.toUpperCase()}
                </p>
              </div>

              <div className="flex items-center gap-3">
                {service.oldPrice && service.oldPrice > 0 && (
                  <InlineEdit
                    value={String(service.oldPrice)}
                    onSave={(v) => updateService(catIndex, svcIndex, { oldPrice: Number(v) || 0 })}
                    placeholder="Old"
                    className="text-xs line-through font-body text-[#9CA3AF] cursor-pointer"
                    inputClassName="w-16 text-xs line-through font-body text-[#9CA3AF] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none text-right"
                  />
                )}
                <div className="font-heading font-bold text-lg text-[#5C3A2E] flex items-center">
                  <IndianRupee className="w-4 h-4 -mr-0.5 pointer-events-none" />
                  <InlineEdit
                    value={String(service.price)}
                    onSave={(v) => updateService(catIndex, svcIndex, { price: Number(v) || 0 })}
                    placeholder="0"
                    className="cursor-pointer hover:text-[#3E2723] transition-colors"
                    inputClassName="w-20 font-heading font-bold text-lg text-[#5C3A2E] border border-[#5C3A2E] rounded px-2 py-1 outline-none text-right"
                  />
                </div>
                <button
                  onClick={() => removeService(catIndex, svcIndex)}
                  className="ml-1 p-1.5 rounded-md text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove service"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
