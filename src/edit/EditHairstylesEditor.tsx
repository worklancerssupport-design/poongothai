import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, RefreshCw, Save, RotateCcw, Image as ImageIcon, Search, Pencil, Camera, Upload, Link2, X } from "lucide-react";
import EditHairstyles from "./EditHairstyles";
import type { Hairstyle } from "./types";

type Gender = "mens" | "womens";

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

  const handleDouble = (e: React.MouseEvent | React.TouchEvent) => {
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
      onDoubleClick={handleDouble}
      title="Double-click to edit"
      className={className}
    >
      {value || <span className="opacity-40">{placeholder || "Empty"}</span>}
    </span>
  );
}

interface ImageEditorProps {
  image: string;
  onUrlSet: (url: string) => void;
  onDeviceUpload: () => void;
  onCameraCapture: () => void;
  uploading: boolean;
}

function ImageEditor({ image, onUrlSet, onDeviceUpload, onCameraCapture, uploading }: ImageEditorProps) {
  const [open, setOpen] = useState(false);
  const [urlInput, setUrlInput] = useState("");

  const submit = () => {
    if (urlInput.trim()) {
      onUrlSet(urlInput.trim());
      setUrlInput("");
      setOpen(false);
    }
  };

  return (
    <>
      {/* Image with edit icon overlay */}
      <div
        className="relative overflow-hidden bg-[#E8E4DE] group/img"
        style={{ aspectRatio: "3/4", borderRadius: "8px" }}
      >
        {image ? (
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/img:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ImageIcon className="w-8 h-8 text-[#9CA3AF]" />
          </div>
        )}

        {/* Edit icon — top right */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpen(true);
          }}
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#5C3A2E] hover:bg-white shadow-md transition-all opacity-80 hover:opacity-100"
          aria-label="Edit image"
          title="Edit image"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>

        {uploading && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 text-white animate-spin" />
          </div>
        )}
      </div>

      {/* Cloudinary dashboard modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 8 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-[#FAF7F0] rounded-2xl border border-[#E5DFCF] shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5DFCF]">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#C6A15B]" />
                  <h3 className="font-heading font-semibold text-sm text-[#3E2723]">Change Image</h3>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-full text-[#7A6152] hover:bg-[#5C3A2E]/5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-5 space-y-4">
                {/* URL input */}
                <div>
                  <label className="block font-body text-[10px] font-bold uppercase tracking-[0.2em] text-[#9A6B52] mb-2">
                    <Link2 className="w-3 h-3 inline mr-1" />
                    Image URL
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && submit()}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 text-sm font-body bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E]"
                    />
                    <button
                      onClick={submit}
                      disabled={!urlInput.trim()}
                      className="px-3 py-2 text-[10px] font-body font-semibold tracking-widest uppercase text-white bg-[#5C3A2E] rounded-lg hover:bg-[#3E2723] disabled:opacity-40"
                    >
                      Set
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex-1 h-px bg-[#E5DFCF]" />
                  <span className="font-body text-[9px] tracking-widest uppercase text-[#9CA3AF]">or</span>
                  <div className="flex-1 h-px bg-[#E5DFCF]" />
                </div>

                {/* Upload buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onDeviceUpload();
                      setOpen(false);
                    }}
                    disabled={uploading}
                    className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-lg border border-[#E5DFCF] hover:border-[#5C3A2E] hover:bg-[#5C3A2E]/5 transition-colors disabled:opacity-40"
                  >
                    <Upload className="w-4 h-4 text-[#5C3A2E]" />
                    <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#5C3A2E]">
                      Upload
                    </span>
                  </button>
                  <button
                    onClick={() => {
                      onCameraCapture();
                      setOpen(false);
                    }}
                    disabled={uploading}
                    className="flex flex-col items-center gap-1.5 py-4 px-3 rounded-lg border border-[#E5DFCF] hover:border-[#5C3A2E] hover:bg-[#5C3A2E]/5 transition-colors disabled:opacity-40"
                  >
                    <Camera className="w-4 h-4 text-[#5C3A2E]" />
                    <span className="font-body text-[10px] font-semibold tracking-widest uppercase text-[#5C3A2E]">
                      Camera
                    </span>
                  </button>
                </div>

                <p className="font-body text-[10px] text-[#9CA3AF] text-center pt-1">
                  Images are compressed & uploaded via Cloudinary
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HairstyleCard({
  item,
  index,
  gender,
  onUpdate,
  onRemove,
  onUrlSet,
  onDeviceUpload,
  onCameraCapture,
  uploadingImage,
}: {
  item: Hairstyle;
  index: number;
  gender: Gender;
  onUpdate: (updates: Partial<Hairstyle>) => void;
  onRemove: () => void;
  onUrlSet: (url: string) => void;
  onDeviceUpload: () => void;
  onCameraCapture: () => void;
  uploadingImage: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min((index % 4) * 0.05, 0.2) }}
      className="group text-left w-full relative"
    >
      {/* Delete button — top left */}
      <button
        onClick={onRemove}
        className="absolute top-2.5 left-2.5 z-10 w-7 h-7 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-[#9CA3AF] hover:text-red-600 hover:bg-white shadow-md transition-all opacity-0 group-hover:opacity-100"
        aria-label="Remove hairstyle"
        title="Remove"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>

      {/* Image */}
      <ImageEditor
        image={item.image}
        onUrlSet={onUrlSet}
        onDeviceUpload={onDeviceUpload}
        onCameraCapture={onCameraCapture}
        uploading={uploadingImage}
      />

      {/* Label & price */}
      <div className="mt-3.5 px-0.5">
        <InlineEdit
          value={item.name}
          onSave={(v) => onUpdate({ name: v })}
          placeholder="Hairstyle name"
          className="block font-heading font-semibold text-base leading-tight text-[#2B2118] cursor-pointer hover:text-[#5C3A2E] transition-colors"
          inputClassName="w-full font-heading font-semibold text-base text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#5C3A2E]/10"
        />
        <p className="text-xs font-body mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: "#9CA3AF" }}>
          <InlineEdit
            value={item.tags[0] || ""}
            onSave={(v) => onUpdate({ tags: v ? [v] : [] })}
            placeholder="Tag"
            className="cursor-pointer hover:text-[#5C3A2E] transition-colors"
            inputClassName="w-24 font-body text-xs text-[#9CA3AF] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none"
          />
          <span>·</span>
          <InlineEdit
            value={item.maintenance}
            onSave={(v) => onUpdate({ maintenance: v as "Low" | "Medium" | "High" })}
            placeholder="Maintenance"
            className="cursor-pointer hover:text-[#5C3A2E] transition-colors"
            inputClassName="w-20 font-body text-xs text-[#9CA3AF] border border-[#5C3A2E] rounded px-1.5 py-0.5 outline-none"
          />
        </p>

        {/* Price — editable at bottom */}
        <div className="mt-2 flex items-center gap-0.5">
          <span className="font-heading font-bold text-base text-[#5C3A2E] pointer-events-none select-none">₹</span>
          <InlineEdit
            value={item.price || ""}
            onSave={(v) => onUpdate({ price: v })}
            placeholder="0"
            className="font-heading font-bold text-base text-[#5C3A2E] cursor-pointer hover:text-[#3E2723] transition-colors"
            inputClassName="w-24 font-heading font-bold text-base text-[#5C3A2E] border border-[#5C3A2E] rounded px-2 py-1 outline-none focus:ring-2 focus:ring-[#5C3A2E]/10"
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function EditHairstylesEditor() {
  const [filter, setFilter] = useState("");
  const [activeGender, setActiveGender] = useState<Gender>("mens");

  return (
    <section className="section relative overflow-hidden" style={{ background: "#F8F1E7" }}>
      <div className="wrap relative z-10">
        {/* Section header */}
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#C6A15B]" />
            <span className="label text-[#9A6B52]">HAIRSTYLES / 02</span>
          </div>
          <h2
            className="font-heading font-bold text-[#3E2723]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            EDIT YOUR
            <br />
            <span style={{ color: "#5C3A2E" }}>HAIRSTYLES.</span>
          </h2>
          <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
            Click the pencil icon on an image to change it. Double-click titles or prices to edit. Add or remove styles — save when done.
          </p>
        </div>

        <EditHairstyles>
          {({
            editData,
            loading,
            saving,
            error,
            hasChanges,
            refresh,
            updateItem,
            addItem,
            removeItem,
            save,
            discard,
            uploadImageFromDevice,
            uploadImageFromCamera,
            setImageUrl,
            uploadingImage,
          }) => {
            if (loading) {
              return (
                <div className="flex items-center justify-center py-20">
                  <RefreshCw className="w-5 h-5 text-[#C6A15B] animate-spin" />
                  <span className="ml-3 font-body text-sm text-[#7A6152]">Loading hairstyles…</span>
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

            const list = editData[activeGender];
            const filtered = list.filter((item) => {
              const q = filter.trim().toLowerCase();
              if (!q) return true;
              return (
                item.name.toLowerCase().includes(q) ||
                item.tags.some((t) => t.toLowerCase().includes(q)) ||
                item.description.toLowerCase().includes(q)
              );
            });

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
                        placeholder="Filter hairstyles…"
                        className="pl-9 pr-3 py-2 text-xs font-body bg-white border border-[#E5DFCF] rounded-lg text-[#2B2118] placeholder-[#9CA3AF] focus:outline-none focus:border-[#5C3A2E] transition-colors w-44 sm:w-56"
                      />
                    </div>

                    <div className="inline-flex rounded-lg p-0.5 bg-[#FAF7F0] border border-[#E5DFCF]">
                      {(["mens", "womens"] as const).map((g) => (
                        <button
                          key={g}
                          onClick={() => setActiveGender(g)}
                          className={`px-4 py-1.5 text-[10px] font-body font-bold tracking-widest rounded-md uppercase transition-all ${
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
                      {filtered.length} of {list.length} items
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

                {/* Cards grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-5 gap-y-8">
                  {filtered.map((item, idx) => {
                    const realIndex = list.indexOf(item);
                    return (
                      <HairstyleCard
                        key={`${activeGender}-${realIndex}-${item.id}-${idx}`}
                        item={item}
                        index={idx}
                        gender={activeGender}
                        onUpdate={(updates) => updateItem(activeGender, realIndex, updates)}
                        onRemove={() => removeItem(activeGender, realIndex)}
                        onUrlSet={(url) => setImageUrl(activeGender, realIndex, url)}
                        onDeviceUpload={() => uploadImageFromDevice(activeGender, realIndex)}
                        onCameraCapture={() => uploadImageFromCamera(activeGender, realIndex)}
                        uploadingImage={uploadingImage}
                      />
                    );
                  })}

                  {/* Add new card */}
                  <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() =>
                      addItem(activeGender, {
                        id: `new-${Date.now()}`,
                        name: "New Hairstyle",
                        description: "Describe this hairstyle",
                        image: "",
                        gender: activeGender === "mens" ? "men" : "women",
                        tags: ["New"],
                        bestFor: "All Face Shapes",
                        maintenance: "Low",
                        time: "30 min",
                        price: "0",
                        suitableHair: "All Hair Types",
                      })
                    }
                    className="group flex flex-col items-center justify-center border-2 border-dashed border-[#E5DFCF] hover:border-[#C6A15B] rounded-lg transition-colors min-h-[280px]"
                    style={{ aspectRatio: "3/4" }}
                  >
                    <div className="flex flex-col items-center gap-2 text-[#9A6B52] group-hover:text-[#C6A15B] transition-colors">
                      <Plus className="w-6 h-6" />
                      <span className="font-body text-[10px] font-semibold tracking-widest uppercase">
                        Add Hairstyle
                      </span>
                    </div>
                  </motion.button>
                </div>
              </div>
            );
          }}
        </EditHairstyles>
      </div>
    </section>
  );
}