import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RefreshCw, Save, RotateCcw, IndianRupee, Search, Pencil } from "lucide-react";
import EditCatalogue from "./EditCatalogue";
import type { CatalogueItem } from "./types";

type EditField = "SERVICE" | "PRICE" | "OLD PRICE" | "SERVICE_NAME" | "TYPE" | "GENDER" | "image_url";

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
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          } else if (e.key === "Escape") {
            e.preventDefault();
            cancel();
          }
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

export default function EditCatalogueEditor() {
  const [filter, setFilter] = useState("");
  const [activeGender, setActiveGender] = useState<"ALL" | "MENS" | "WOMEN" | "KIDS">("ALL");

  return (
    <section className="section relative overflow-hidden" style={{ background: "#F8F1E7" }}>
      <div className="wrap relative z-10">
        {/* Section header */}
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#C6A15B]" />
            <span className="label text-[#9A6B52]">CATALOGUE / 01</span>
          </div>
          <h2
            className="font-heading font-bold text-[#3E2723]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            EDIT YOUR
            <br />
            <span style={{ color: "#5C3A2E" }}>CATALOGUE.</span>
          </h2>
          <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
            Double-click any service title or price to edit. Add new items or remove existing ones — save when done.
          </p>
        </div>

        <EditCatalogue>
          {({ editData, loading, saving, error, hasChanges, refresh, updateItem, addItem, removeItem, save, discard }) => {
            if (loading) {
              return (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-5 h-5 text-[#C6A15B] animate-spin" />
                  <span className="ml-3 font-body text-sm text-[#7A6152]">Loading catalogue…</span>
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

            const filtered = editData.filter((item) => {
              const matchGender = activeGender === "ALL" || item.GENDER.toUpperCase() === activeGender;
              const q = filter.trim().toLowerCase();
              const matchSearch =
                !q ||
                item.SERVICE.toLowerCase().includes(q) ||
                item.SERVICE_NAME.toLowerCase().includes(q) ||
                item.TYPE.toLowerCase().includes(q);
              return matchGender && matchSearch;
            });

            const updateField = (index: number, field: EditField, val: string) => {
              updateItem(index, { [field]: val } as Partial<CatalogueItem>);
            };

            return (
              <div>
                {/* Action bar */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9A6B52] pointer-events-none" />
                      <input
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        placeholder="Filter services…"
                        className="pl-9 pr-3 py-2 text-xs font-body bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] transition-colors w-44 sm:w-56"
                      />
                    </div>

                    <div className="inline-flex rounded-lg p-0.5 bg-[#FAF7F0] border border-[#E5DFCF]">
                      {(["ALL", "MENS", "WOMEN", "KIDS"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setActiveGender(g)}
                          className={`px-3 py-1.5 text-[10px] font-body font-bold tracking-widest rounded-md uppercase transition-all ${
                            activeGender === g
                              ? "bg-[#5C3A2E] text-white shadow-sm"
                              : "text-[#5C3A2E] hover:bg-[#5C3A2E]/5"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>

                    <span className="font-body text-[10px] text-[#9A6B52] tracking-wide">
                      {filtered.length} of {editData.length} items
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
                      <span className="font-body text-[11px] text-[#B4821F]">
                        You have unsaved changes
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Items list — mirrors Services.tsx service row style */}
                <div className="bg-white rounded-2xl border border-[#E5DFCF] shadow-sm overflow-hidden">
                  <div className="max-h-[700px] overflow-y-auto">
                    {filtered.length === 0 ? (
                      <div className="py-16 text-center">
                        <p className="font-heading text-base text-[#5C3A2E] mb-1">No items match</p>
                        <p className="font-body text-xs text-[#9CA3AF]">Try a different filter or add a new item</p>
                      </div>
                    ) : (
                      filtered.map((item, idx) => {
                        const realIndex = editData.indexOf(item);
                        const hasOffer = item["OLD PRICE"] && item["OLD PRICE"] !== item.PRICE && item["OLD PRICE"].trim() !== "";
                        return (
                          <motion.div
                            key={`${realIndex}-${item.SERVICE}-${idx}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: Math.min(idx * 0.01, 0.15) }}
                            className="group flex items-center justify-between gap-3 py-3.5 px-4 sm:px-5 border-b border-[#E5DFCF]/60 last:border-b-0 transition-colors hover:bg-[#FFF9F2]"
                          >
                            {/* Service info — editable */}
                            <div className="flex-1 min-w-0">
                              <InlineEdit
                                value={item.SERVICE}
                                onSave={(v) => updateField(realIndex, "SERVICE", v)}
                                placeholder="Service name"
                                className="block font-heading font-semibold text-sm sm:text-base text-[#2B2118] cursor-pointer hover:text-[#5C3A2E] transition-colors leading-snug truncate"
                                inputClassName="w-full font-heading font-semibold text-sm sm:text-base text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#5C3A2E]/10"
                              />
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <InlineEdit
                                  value={item.SERVICE_NAME}
                                  onSave={(v) => updateField(realIndex, "SERVICE_NAME", v)}
                                  placeholder="Category"
                                  className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#9A6B52] cursor-pointer hover:text-[#5C3A2E] transition-colors"
                                  inputClassName="w-32 font-body text-[10px] font-semibold uppercase tracking-wider text-[#9A6B52] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none"
                                />
                                <span className="text-[#E5DFCF]">•</span>
                                <InlineEdit
                                  value={item.GENDER}
                                  onSave={(v) => updateField(realIndex, "GENDER", v)}
                                  placeholder="Gender"
                                  className="font-body text-[10px] font-semibold uppercase tracking-wider text-[#9A6B52] cursor-pointer hover:text-[#5C3A2E] transition-colors"
                                  inputClassName="w-20 font-body text-[10px] font-semibold uppercase tracking-wider text-[#9A6B52] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none"
                                />
                              </div>
                            </div>

                            {/* Price — editable */}
                            <div className="text-right shrink-0 flex items-center gap-2 sm:gap-3">
                              {hasOffer && (
                                <InlineEdit
                                  value={item["OLD PRICE"]}
                                  onSave={(v) => updateField(realIndex, "OLD PRICE", v)}
                                  placeholder="Old"
                                  className="hidden sm:inline text-xs line-through font-body text-[#9CA3AF] cursor-pointer"
                                  inputClassName="w-16 text-xs line-through font-body text-[#9CA3AF] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none"
                                />
                              )}
                              <InlineEdit
                                value={item.PRICE}
                                onSave={(v) => updateField(realIndex, "PRICE", v)}
                                placeholder="0"
                                className="font-heading font-bold text-lg sm:text-xl text-[#5C3A2E] leading-none flex items-center cursor-pointer hover:text-[#3E2723] transition-colors"
                                inputClassName="w-20 font-heading font-bold text-lg text-[#5C3A2E] border border-[#5C3A2E] rounded px-2 py-1 outline-none text-right"
                              />
                              <span className="font-heading font-bold text-lg sm:text-xl text-[#5C3A2E] leading-none flex items-center pointer-events-none -ml-1">
                                <IndianRupee className="w-4 h-4 -mr-0.5" />
                              </span>
                              <button
                                onClick={() => removeItem(realIndex)}
                                className="ml-1 p-1.5 rounded-md text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-60 group-hover:opacity-100"
                                aria-label="Remove item"
                                title="Remove"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </motion.div>
                        );
                      })
                    )}
                  </div>

                  {/* Add new item */}
                  <div className="border-t border-[#E5DFCF] bg-[#FDFAF6]">
                    <button
                      onClick={() =>
                        addItem({
                          GENDER: "MENS",
                          SERVICE_NAME: "Hair Cut",
                          SERVICE: "New Service",
                          TYPE: "",
                          PRICE: "0",
                          "OLD PRICE": "",
                          image_url: "",
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 font-body text-xs font-semibold tracking-widest uppercase text-[#5C3A2E] hover:bg-[#5C3A2E]/5 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add New Item
                    </button>
                  </div>
                </div>
              </div>
            );
          }}
        </EditCatalogue>
      </div>
    </section>
  );
}