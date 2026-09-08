import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Trash2,
  RefreshCw,
  Save,
  RotateCcw,
  Pencil,
  Sparkles,
  Check,
  Image as ImageIcon,
  Award,
  User,
  Store,
} from "lucide-react";
import EditOwner from "./EditOwner";
import type { OwnerData, ShopImage } from "@/lib/fetchData";

/* ── Inline-edit field (double-click to edit) ── */
function InlineEdit({
  value,
  onSave,
  placeholder,
  className,
  inputClassName,
  multiline,
}: {
  value: string;
  onSave: (val: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  multiline?: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

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
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") { e.preventDefault(); cancel(); }
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); commit(); }
          }}
          onClick={(e) => e.stopPropagation()}
          placeholder={placeholder}
          rows={Math.max(3, draft.split("\n").length)}
          className={inputClassName}
          autoFocus
        />
      );
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
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

/* ── Shop Space Image Card ── */
function ShopImageCard({
  image,
  index,
  onUpdate,
  onRemove,
}: {
  image: ShopImage;
  index: number;
  onUpdate: (updates: Partial<ShopImage>) => void;
  onRemove: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.2) }}
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-white border border-[#E8D8C3] shadow-[0_4px_20px_rgba(92,58,46,0.05)] hover:shadow-[0_8px_28px_rgba(92,58,46,0.08)] transition-all"
    >
      <button
        onClick={onRemove}
        className="absolute top-3 right-3 z-10 p-1.5 rounded-md text-white bg-black/40 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Remove image"
        title="Remove image"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      <div className="relative aspect-[4/3] bg-[#FDFAF6] overflow-hidden">
        {image.src ? (
          <img
            src={image.src}
            alt={image.alt}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-[#9CA3AF]">
            <ImageIcon className="w-8 h-8 mb-2" />
            <span className="font-body text-[10px] uppercase tracking-widest">No image</span>
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <label className="flex flex-col gap-1">
          <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Title</span>
          <InlineEdit
            value={image.title}
            onSave={(v) => onUpdate({ title: v })}
            placeholder="Image title"
            className="font-heading font-bold text-sm text-[#3E2723] cursor-pointer"
            inputClassName="w-full font-heading font-bold text-sm text-[#3E2723] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Alt Text</span>
          <InlineEdit
            value={image.alt}
            onSave={(v) => onUpdate({ alt: v })}
            placeholder="Alt text for accessibility"
            className="font-body text-xs text-[#7A6152] cursor-pointer"
            inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Image URL</span>
          <InlineEdit
            value={image.src}
            onSave={(v) => onUpdate({ src: v })}
            placeholder="https://..."
            className="font-body text-[10px] text-[#9CA3AF] truncate cursor-pointer"
            inputClassName="w-full font-body text-[10px] text-[#9CA3AF] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
          />
        </label>
      </div>
    </motion.div>
  );
}

/* ── Awards List Editor ── */
function AwardsListEditor({
  awards,
  onChange,
}: {
  awards: string[];
  onChange: (next: string[]) => void;
}) {
  const updateAt = (i: number, v: string) => {
    const next = [...awards];
    next[i] = v;
    onChange(next);
  };
  const removeAt = (i: number) => onChange(awards.filter((_, idx) => idx !== i));
  const addNew = () => onChange([...awards, "New Award / Recognition"]);

  return (
    <div className="space-y-2">
      {awards.map((award, i) => (
        <div
          key={`${award}-${i}`}
          className="group flex items-center gap-2.5 p-2.5 rounded-lg border border-[#E8D8C3]/60 bg-[#FDFAF6]"
        >
          <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 bg-[#5C3A2E] text-white">
            <Award className="w-3 h-3" />
          </div>
          <InlineEdit
            value={award}
            onSave={(v) => updateAt(i, v)}
            placeholder="Award or recognition"
            className="flex-1 min-w-0 font-body text-sm text-[#2B2118] cursor-pointer"
            inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
          />
          <button
            onClick={() => removeAt(i)}
            className="p-1 rounded text-[#9CA3AF] hover:text-red-600 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove award"
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
        Add Award
      </button>
    </div>
  );
}

/* ── Section wrapper ── */
export default function EditOwnerEditor() {
  return (
    <section className="section relative overflow-hidden" style={{ background: "#F0E6D8" }}>
      <div className="wrap relative z-10">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#C6A15B]" />
            <span className="label text-[#9A6B52]">SHOP & EXPERT / 04</span>
          </div>
          <h2
            className="font-heading font-bold text-[#3E2723]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            EDIT YOUR
            <br />
            <span style={{ color: "#5C3A2E" }}>SHOP & EXPERT.</span>
          </h2>
          <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
            Double-click any field to edit. Manage the Shop Space gallery and the Meet the Expert profile in one place.
          </p>
        </div>

        <EditOwner>
          {({
            editData,
            loading,
            saving,
            error,
            hasChanges,
            refresh,
            updateOwner,
            updateShopImage,
            addShopImage,
            removeShopImage,
            save,
            discard,
          }) => (
            <OwnerExplorer
              editData={editData}
              loading={loading}
              saving={saving}
              error={error}
              hasChanges={hasChanges}
              refresh={refresh}
              updateOwner={updateOwner}
              updateShopImage={updateShopImage}
              addShopImage={addShopImage}
              removeShopImage={removeShopImage}
              save={save}
              discard={discard}
            />
          )}
        </EditOwner>
      </div>
    </section>
  );
}

/* ── Explorer (valid hook context) ── */
function OwnerExplorer({
  editData,
  loading,
  saving,
  error,
  hasChanges,
  refresh,
  updateOwner,
  updateShopImage,
  addShopImage,
  removeShopImage,
  save,
  discard,
}: {
  editData: OwnerData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  hasChanges: boolean;
  refresh: () => void;
  updateOwner: (updates: Partial<OwnerData>) => void;
  updateShopImage: (index: number, updates: Partial<ShopImage>) => void;
  addShopImage: (image: ShopImage) => void;
  removeShopImage: (index: number) => void;
  save: () => Promise<boolean>;
  discard: () => void;
}) {
  type TabKey = "shop" | "expert";
  const [activeTab, setActiveTab] = useState<TabKey>("shop");

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-5 h-5 text-[#C6A15B] animate-spin" />
        <span className="ml-3 font-body text-sm text-[#7A6152]">Loading…</span>
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

  const handleAddImage = () => {
    const id = Date.now().toString(36);
    const newImage: ShopImage = {
      src: "",
      alt: "Salon interior",
      title: `New Image ${id}`,
    };
    addShopImage(newImage);
  };

  const tabs: { key: TabKey; label: string; icon: React.ReactNode }[] = [
    { key: "shop", label: "Shop Space", icon: <Store className="w-3.5 h-3.5" /> },
    { key: "expert", label: "Meet the Expert", icon: <User className="w-3.5 h-3.5" /> },
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
                className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 font-body font-medium text-[10px] sm:text-xs tracking-wider rounded-md transition-all duration-200"
                style={{
                  background: activeTab === t.key ? "#5C3A2E" : "transparent",
                  color: activeTab === t.key ? "#FFFFFF" : "#7A6152",
                }}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
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

      {/* Tab content */}
      <AnimatePresence mode="wait">
        {activeTab === "shop" ? (
          <motion.div
            key="shop"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Section header */}
            <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8D8C3]">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-[#F8F1E7] flex items-center justify-center">
                  <Store className="w-4 h-4 text-[#5C3A2E]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#3E2723]">Shop Space Description</h3>
                  <p className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest">Gallery intro text</p>
                </div>
              </div>
              <InlineEdit
                value={editData.shopSpaceDescription}
                onSave={(v) => updateOwner({ shopSpaceDescription: v })}
                placeholder="Description shown above the gallery"
                multiline
                className="font-body text-sm text-[#7A6152] leading-relaxed cursor-pointer block whitespace-pre-wrap"
                inputClassName="w-full font-body text-sm text-[#7A6152] border border-[#5C3A2E] rounded px-3 py-2 outline-none resize-y"
              />
            </div>

            {/* Gallery images */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-heading font-bold text-base text-[#3E2723]">Gallery Images</h3>
                <p className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest mt-0.5">
                  {editData.shopImages.length} of {editData.shopImages.length} images
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {editData.shopImages.map((img, idx) => (
                <ShopImageCard
                  key={`${img.src}-${idx}`}
                  image={img}
                  index={idx}
                  onUpdate={(updates) => updateShopImage(idx, updates)}
                  onRemove={() => removeShopImage(idx)}
                />
              ))}

              <button
                onClick={handleAddImage}
                className="flex flex-col items-center justify-center min-h-[300px] rounded-2xl border-2 border-dashed border-[#E5DFCF] bg-white/50 hover:bg-[#5C3A2E]/5 hover:border-[#5C3A2E]/40 transition-all duration-200 group"
              >
                <div className="w-14 h-14 rounded-full bg-[#F8F1E7] flex items-center justify-center mb-3 group-hover:bg-[#5C3A2E] group-hover:text-white transition-colors">
                  <Plus className="w-6 h-6 text-[#5C3A2E] group-hover:text-white transition-colors" />
                </div>
                <span className="font-heading font-semibold text-sm text-[#5C3A2E] mb-1">Add New Image</span>
                <span className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-wider">
                  Shop photo
                </span>
              </button>
            </div>

            {editData.shopImages.length === 0 && (
              <div className="py-16 text-center">
                <Sparkles className="w-8 h-8 text-[#C6A15B] mx-auto mb-3" />
                <p className="font-heading text-base text-[#5C3A2E] mb-1">No gallery images yet</p>
                <p className="font-body text-xs text-[#9CA3AF]">Click "Add New Image" to add the first one.</p>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="expert"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Profile card */}
            <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8D8C3]">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-full bg-[#F8F1E7] flex items-center justify-center">
                  <User className="w-4 h-4 text-[#5C3A2E]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-[#3E2723]">Expert Profile</h3>
                  <p className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest">Owner details shown on the About section</p>
                </div>
              </div>

              {/* Photo preview */}
              <div className="flex flex-col sm:flex-row gap-5 mb-5 pb-5 border-b border-[#E8D8C3]/70">
                <div className="shrink-0">
                  <div
                    className="relative overflow-hidden bg-[#ddd8d0]"
                    style={{ aspectRatio: "4/5", borderRadius: "10px", width: "120px" }}
                  >
                    {editData.photo ? (
                      <img
                        src={editData.photo}
                        alt={editData.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-[#9CA3AF]">
                        <User className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0 space-y-3">
                  <label className="flex flex-col gap-1">
                    <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Photo URL</span>
                    <InlineEdit
                      value={editData.photo}
                      onSave={(v) => updateOwner({ photo: v })}
                      placeholder="public/owner.png or https://..."
                      className="font-body text-xs text-[#7A6152] cursor-pointer truncate block"
                      inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                    />
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Name</span>
                      <InlineEdit
                        value={editData.name}
                        onSave={(v) => updateOwner({ name: v })}
                        placeholder="Full name"
                        className="font-heading font-bold text-lg text-[#3E2723] cursor-pointer"
                        inputClassName="w-full font-heading font-bold text-lg text-[#3E2723] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Title</span>
                      <InlineEdit
                        value={editData.title}
                        onSave={(v) => updateOwner({ title: v })}
                        placeholder="Master Stylist & Founder"
                        className="font-body text-sm text-[#C6A15B] cursor-pointer"
                        inputClassName="w-full font-body text-sm text-[#C6A15B] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                      />
                    </label>
                  </div>
                  <label className="flex flex-col gap-1">
                    <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Experience</span>
                    <InlineEdit
                      value={editData.experience}
                      onSave={(v) => updateOwner({ experience: v })}
                      placeholder="27+ Years"
                      className="font-heading font-bold text-2xl text-[#3E2723] cursor-pointer"
                      inputClassName="w-full font-heading font-bold text-2xl text-[#3E2723] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
                    />
                  </label>
                </div>
              </div>

              {/* Description */}
              <label className="flex flex-col gap-2 mb-5">
                <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Bio / Description</span>
                <InlineEdit
                  value={editData.description}
                  onSave={(v) => updateOwner({ description: v })}
                  placeholder="Background and expertise description"
                  multiline
                  className="font-body text-sm text-[#7A6152] leading-[1.9] cursor-pointer block whitespace-pre-wrap"
                  inputClassName="w-full font-body text-sm text-[#7A6152] border border-[#5C3A2E] rounded px-3 py-2 outline-none resize-y"
                />
              </label>

              {/* Meet the Expert intro (description above name) */}
              <label className="flex flex-col gap-2 mb-5 pt-5 border-t border-[#E8D8C3]/70">
                <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52]">Meet the Expert — Intro text (shown above name)</span>
                <InlineEdit
                  value={editData.meetTheExpertDescription}
                  onSave={(v) => updateOwner({ meetTheExpertDescription: v })}
                  placeholder="Intro line for the Meet the Expert section"
                  multiline
                  className="font-body text-sm text-[#7A6152] leading-[1.9] cursor-pointer block whitespace-pre-wrap"
                  inputClassName="w-full font-body text-sm text-[#7A6152] border border-[#5C3A2E] rounded px-3 py-2 outline-none resize-y"
                />
              </label>

              {/* Awards */}
              <div className="pt-5 border-t border-[#E8D8C3]/70">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-[#C6A15B]" />
                  <h4 className="font-heading font-bold text-sm text-[#3E2723]">Awards & Recognition</h4>
                  <span className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest">
                    ({editData.awards.length})
                  </span>
                </div>
                <AwardsListEditor
                  awards={editData.awards}
                  onChange={(next) => updateOwner({ awards: next })}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
