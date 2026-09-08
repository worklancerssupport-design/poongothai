import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  RefreshCw,
  Save,
  RotateCcw,
  IndianRupee,
  Pencil,
  Sparkles,
  Check,
} from "lucide-react";
import EditPackages from "./EditPackages";
import type { Package } from "@/lib/fetchData";

const GENDERS = ["men", "women"] as const;
type Gender = (typeof GENDERS)[number];

/* ── Inline-edit field (double-click to edit) ── */
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
      onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
      title="Double-click to edit"
      className={className}
    >
      {value || <span className="opacity-40">{placeholder || "Empty"}</span>}
    </span>
  );
}

/* ── Editable list of included service strings ── */
function EditableIncludesList({
  items,
  onChange,
}: {
  items: string[];
  onChange: (next: string[]) => void;
}) {
  const updateAt = (i: number, v: string) => {
    const next = [...items];
    next[i] = v;
    onChange(next);
  };
  const removeAt = (i: number) => onChange(items.filter((_, idx) => idx !== i));
  const addNew = () => onChange([...items, "New Service"]);

  return (
    <div className="space-y-2">
      {items.map((svc, i) => (
        <div
          key={`${svc}-${i}`}
          className="group flex items-center gap-2.5 p-2 rounded-lg border border-[#E8D8C3]/60 bg-[#FDFAF6]"
        >
          <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-[#5C3A2E] text-white">
            <Check className="w-3 h-3 stroke-[2.5]" />
          </div>
          <InlineEdit
            value={svc}
            onSave={(v) => updateAt(i, v)}
            placeholder="Service name"
            className="flex-1 min-w-0 font-body text-sm text-[#2B2118] cursor-pointer"
            inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
          />
          <button
            onClick={() => removeAt(i)}
            className="p-1 rounded text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove included service"
            title="Remove"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      ))}
      <button
        onClick={addNew}
        className="w-full mt-1 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-[#5C3A2E] border border-dashed border-[#E5DFCF] rounded-lg hover:bg-[#5C3A2E]/5 transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus className="w-3 h-3" />
        Add Included Service
      </button>
    </div>
  );
}

/* ── Editable package card (mirrors main-page PackageCard) ── */
function PackageCardEditor({
  pkg,
  index,
  isFeatured,
  onUpdate,
  onRemove,
}: {
  pkg: Package;
  index: number;
  isFeatured: boolean;
  onUpdate: (updates: Partial<Package>) => void;
  onRemove: () => void;
}) {
  const servicesPreview = pkg.includes.slice(0, 4).join(" • ");
  const hasMore = pkg.includes.length > 4;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      className={`group relative flex flex-col rounded-2xl transition-all duration-300 p-5 sm:p-6 ${
        isFeatured
          ? "bg-[#FFF9F2] border-2 border-[#9A6B52] shadow-[0_12px_36px_rgba(92,58,46,0.12)]"
          : "bg-white border border-[#E8D8C3] shadow-[0_4px_20px_rgba(92,58,46,0.05)]"
      }`}
    >
      {isFeatured && (
        <div className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#5C3A2E] text-white font-body text-[10px] font-semibold uppercase tracking-widest shadow-sm">
          Featured Package
        </div>
      )}

      {/* Remove card button */}
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove package"
        title="Remove package"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-body text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9A6B52]">
          SPECIAL PACKAGE
        </span>
        <span className="text-xs font-body text-[#9CA3AF]">
          {pkg.includes.length} Services
        </span>
      </div>

      <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#3E2723] leading-snug mb-2">
        <InlineEdit
          value={pkg.title}
          onSave={(v) => onUpdate({ title: v })}
          placeholder="Package title"
          className="cursor-pointer"
          inputClassName="w-full font-heading font-bold text-xl sm:text-2xl text-[#3E2723] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
        />
      </h3>

      <p className="font-body text-xs text-[#7A6152] leading-relaxed line-clamp-2 mb-2">
        {servicesPreview}
        {hasMore ? " and more…" : ""}
      </p>

      <p className="font-body text-[11px] text-[#9CA3AF] italic leading-normal mb-4 line-clamp-1">
        &ldquo;
        <InlineEdit
          value={pkg.description}
          onSave={(v) => onUpdate({ description: v })}
          placeholder="Short description"
          className="cursor-pointer"
          inputClassName="w-full font-body text-[11px] text-[#9CA3AF] italic border border-[#5C3A2E] rounded px-2 py-1 outline-none"
        />
        &rdquo;
      </p>

      {/* Includes (collapsible edit panel) */}
      <details className="mb-4 rounded-lg border border-[#E8D8C3]/70 bg-[#FDFAF6]">
        <summary className="cursor-pointer list-none px-3 py-2 flex items-center justify-between font-body text-[10px] font-semibold uppercase tracking-widest text-[#5C3A2E]">
          <span>Included Services ({pkg.includes.length})</span>
          <span className="text-[#9CA3AF] text-[10px]">Click to edit</span>
        </summary>
        <div className="p-3 pt-1">
          <EditableIncludesList
            items={pkg.includes}
            onChange={(next) => onUpdate({ includes: next })}
          />
        </div>
      </details>

      {/* Pricing */}
      <div className="pt-4 mt-auto border-t border-[#E8D8C3]/70 flex flex-col gap-3">
        <div className="flex items-end justify-between">
          <div>
            <span className="block text-xs font-body text-[#9CA3AF] line-through leading-tight">
              ₹
              <InlineEdit
                value={String(pkg.oldPrice)}
                onSave={(v) => onUpdate({ oldPrice: Number(v) || 0 })}
                placeholder="0"
                className="cursor-pointer"
                inputClassName="w-16 text-xs line-through font-body text-[#9CA3AF] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none text-right"
              />
            </span>
            <div className="flex items-center font-heading font-bold text-2xl sm:text-3xl text-[#5C3A2E] leading-none mt-1">
              <IndianRupee className="w-4 h-4 sm:w-5 sm:h-5 -mr-0.5" />
              <InlineEdit
                value={String(pkg.newPrice)}
                onSave={(v) => onUpdate({ newPrice: Number(v) || 0 })}
                placeholder="0"
                className="cursor-pointer"
                inputClassName="w-24 font-heading font-bold text-2xl text-[#5C3A2E] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </div>
            <span className="block text-[10px] font-body text-[#9A6B52] mt-1">
              Savings ₹
              <InlineEdit
                value={String(pkg.savings)}
                onSave={(v) => onUpdate({ savings: Number(v) || 0 })}
                placeholder="0"
                className="cursor-pointer"
                inputClassName="w-14 text-[10px] font-body text-[#9A6B52] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none text-right"
              />
            </span>
          </div>
        </div>

        {/* Meta controls: gender, tag, popular */}
        <div className="grid grid-cols-3 gap-2">
          <label className="flex flex-col gap-1">
            <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Gender</span>
            <select
              value={pkg.gender}
              onChange={(e) => onUpdate({ gender: e.target.value as Gender })}
              className="px-2 py-1.5 font-body text-xs bg-white border border-[#E5DFCF] rounded-md text-[#2B2118] focus:outline-none focus:border-[#5C3A2E]"
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Tag</span>
            <input
              type="text"
              value={pkg.tag ?? ""}
              onChange={(e) => onUpdate({ tag: e.target.value || undefined })}
              placeholder="(none)"
              className="px-2 py-1.5 font-body text-xs bg-white border border-[#E5DFCF] rounded-md text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E]"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Popular</span>
            <button
              onClick={() => onUpdate({ popular: !pkg.popular })}
              className={`px-2 py-1.5 font-body text-[10px] font-semibold uppercase tracking-wider rounded-md border transition-colors ${
                pkg.popular
                  ? "bg-[#5C3A2E] text-white border-[#5C3A2E]"
                  : "bg-white text-[#7A6152] border-[#E5DFCF] hover:bg-[#5C3A2E]/5"
              }`}
            >
              {pkg.popular ? "Yes" : "No"}
            </button>
          </label>
        </div>

        {/* ID (reference) */}
        <div className="flex items-center justify-between font-body text-[9px] text-[#9CA3AF] tracking-wider uppercase">
          <span>ID: {pkg.id}</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Section wrapper ── */
export default function EditPackagesEditor() {
  return (
    <section className="section relative overflow-hidden" style={{ background: "#F8F1E7" }}>
      <div className="wrap relative z-10">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#C6A15B]" />
            <span className="label text-[#9A6B52]">PACKAGES / 03</span>
          </div>
          <h2
            className="font-heading font-bold text-[#3E2723]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            EDIT YOUR
            <br />
            <span style={{ color: "#5C3A2E" }}>PACKAGES.</span>
          </h2>
          <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
            Double-click any field to edit. Add or remove packages — save when done.
          </p>
        </div>

        <EditPackages>
          {({
            editData,
            loading,
            saving,
            error,
            hasChanges,
            refresh,
            updatePackage,
            addPackage,
            removePackage,
            save,
            discard,
          }) => (
            <PackagesExplorer
              editData={editData}
              loading={loading}
              saving={saving}
              error={error}
              hasChanges={hasChanges}
              refresh={refresh}
              updatePackage={updatePackage}
              addPackage={addPackage}
              removePackage={removePackage}
              save={save}
              discard={discard}
            />
          )}
        </EditPackages>
      </div>
    </section>
  );
}

/* ── Explorer component (valid hook context) ── */
function PackagesExplorer({
  editData,
  loading,
  saving,
  error,
  hasChanges,
  refresh,
  updatePackage,
  addPackage,
  removePackage,
  save,
  discard,
}: {
  editData: Package[] | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  hasChanges: boolean;
  refresh: () => void;
  updatePackage: (index: number, updates: Partial<Package>) => void;
  addPackage: (pkg: Package) => void;
  removePackage: (index: number) => void;
  save: () => Promise<boolean>;
  discard: () => void;
}) {
  type TabKey = "all" | "men" | "women";
  const [activeTab, setActiveTab] = useState<TabKey>("all");

  const filtered = (editData ?? []).filter((p) => {
    if (activeTab === "all") return true;
    if (activeTab === "men") return p.gender === "men";
    return p.gender === "women";
  });

  const handleAddNew = () => {
    if (!editData) return;
    const id = `pkg-new-${Date.now().toString(36)}`;
    const newPkg: Package = {
      id,
      title: "New Package",
      description: "Describe this package",
      includes: ["Service 1", "Service 2"],
      oldPrice: 999,
      newPrice: 799,
      savings: 200,
      tag: undefined,
      popular: false,
      gender: activeTab === "men" ? "men" : "women",
    };
    addPackage(newPkg);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-5 h-5 text-[#C6A15B] animate-spin" />
        <span className="ml-3 font-body text-sm text-[#7A6152]">Loading packages…</span>
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

  const tabs: { key: TabKey; label: string }[] = [
    { key: "all", label: "All Packages" },
    { key: "men", label: "Men" },
    { key: "women", label: "Women" },
  ];

  return (
    <div>
      {/* Action bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="inline-flex self-start p-1 rounded-lg border border-[#E8D8C3] bg-white shadow-sm">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className="px-3 sm:px-4 py-1.5 font-body font-medium text-[10px] sm:text-xs tracking-wider rounded-md transition-all duration-200"
                style={{
                  background: activeTab === t.key ? "#5C3A2E" : "transparent",
                  color: activeTab === t.key ? "#FFFFFF" : "#7A6152",
                }}
              >
                {t.label}
              </button>
            ))}
          </div>
          <span className="font-body text-[10px] text-[#9A6B52] tracking-wide">
            {filtered.length} of {editData.length} packages
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

      {/* Card grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {filtered.map((pkg, idx) => {
            const realIndex = editData.indexOf(pkg);
            const isFeatured = idx === 0 && activeTab === "all";
            return (
              <PackageCardEditor
                key={pkg.id}
                pkg={pkg}
                index={idx}
                isFeatured={isFeatured}
                onUpdate={(updates) => updatePackage(realIndex, updates)}
                onRemove={() => removePackage(realIndex)}
              />
            );
          })}

          {/* Add new package card */}
          <button
            onClick={handleAddNew}
            className="flex flex-col items-center justify-center min-h-[420px] rounded-2xl border-2 border-dashed border-[#E5DFCF] bg-white/50 hover:bg-[#5C3A2E]/5 hover:border-[#5C3A2E]/40 transition-all duration-200 group"
          >
            <div className="w-14 h-14 rounded-full bg-[#F8F1E7] flex items-center justify-center mb-3 group-hover:bg-[#5C3A2E] group-hover:text-white transition-colors">
              <Plus className="w-6 h-6 text-[#5C3A2E] group-hover:text-white transition-colors" />
            </div>
            <span className="font-heading font-semibold text-sm text-[#5C3A2E] mb-1">Add New Package</span>
            <span className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-wider">
              {activeTab === "men" ? "For Men" : "For Women"}
            </span>
          </button>
        </motion.div>
      </AnimatePresence>

      {filtered.length === 0 && (
        <div className="py-16 text-center">
          <Sparkles className="w-8 h-8 text-[#C6A15B] mx-auto mb-3" />
          <p className="font-heading text-base text-[#5C3A2E] mb-1">No packages in this view</p>
          <p className="font-body text-xs text-[#9CA3AF]">Switch tab or click "Add New Package" to create one.</p>
        </div>
      )}
    </div>
  );
}
