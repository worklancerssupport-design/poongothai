import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RefreshCw,
  Save,
  RotateCcw,
  Pencil,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Globe,
  Hash,
  Send,
} from "lucide-react";
import EditContact from "./EditContact";
import type { ContactData } from "@/lib/fetchData";

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

/* ── Field group ── */
function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52] flex items-center gap-1.5">
        {icon}
        {label}
      </span>
      {children}
    </label>
  );
}

/* ── Section wrapper ── */
export default function EditContactEditor() {
  return (
    <section className="section relative overflow-hidden" style={{ background: "#FFF9F2" }}>
      <div className="wrap relative z-10">
        <div className="flex flex-col mb-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-px bg-[#C6A15B]" />
            <span className="label text-[#9A6B52]">CONTACT / 05</span>
          </div>
          <h2
            className="font-heading font-bold text-[#3E2723]"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", letterSpacing: "-0.025em", lineHeight: 1.1 }}
          >
            EDIT YOUR
            <br />
            <span style={{ color: "#5C3A2E" }}>CONTACT.</span>
          </h2>
          <p className="font-body text-sm text-[#7A6152] mt-3 max-w-md leading-relaxed">
            Double-click any field to edit. Save once to update the public site's contact channels and socials.
          </p>
        </div>

        <EditContact>
          {({
            editData,
            loading,
            saving,
            error,
            hasChanges,
            refresh,
            updateContact,
            save,
            discard,
          }) => (
            <ContactExplorer
              editData={editData}
              loading={loading}
              saving={saving}
              error={error}
              hasChanges={hasChanges}
              refresh={refresh}
              updateContact={updateContact}
              save={save}
              discard={discard}
            />
          )}
        </EditContact>
      </div>
    </section>
  );
}

/* ── Explorer (valid hook context) ── */
function ContactExplorer({
  editData,
  loading,
  saving,
  error,
  hasChanges,
  refresh,
  updateContact,
  save,
  discard,
}: {
  editData: ContactData | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  hasChanges: boolean;
  refresh: () => void;
  updateContact: (updates: Partial<ContactData>) => void;
  save: () => Promise<boolean>;
  discard: () => void;
}) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <RefreshCw className="w-5 h-5 text-[#C6A15B] animate-spin" />
        <span className="ml-3 font-body text-sm text-[#7A6152]">Loading contact…</span>
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
          <div className="inline-flex self-start p-1 rounded-lg border border-[#E8D8C3] bg-white shadow-sm">
            <span
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-1.5 font-body font-medium text-[10px] sm:text-xs tracking-wider rounded-md"
              style={{
                background: "#5C3A2E",
                color: "#FFFFFF",
              }}
            >
              <Globe className="w-3.5 h-3.5" />
              Contact Channels
            </span>
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Left: Channels */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8D8C3]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#F8F1E7] flex items-center justify-center">
              <Phone className="w-4 h-4 text-[#5C3A2E]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#3E2723]">Contact Channels</h3>
              <p className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest">Phone, email, address</p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="Address" icon={<MapPin className="w-3 h-3" />}>
              <InlineEdit
                value={editData.address.full}
                onSave={(v) => updateContact({ address: { full: v } })}
                placeholder="Full salon address"
                multiline
                className="font-body text-sm text-[#2B2118] leading-relaxed cursor-pointer block whitespace-pre-wrap"
                inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-3 py-2 outline-none resize-y"
              />
            </Field>

            <Field label="Phone (Primary)" icon={<Phone className="w-3 h-3" />}>
              <InlineEdit
                value={editData.phone.primary}
                onSave={(v) => updateContact({ phone: { primary: v } })}
                placeholder="90431 46394"
                className="font-heading font-bold text-lg text-[#3E2723] cursor-pointer"
                inputClassName="w-full font-heading font-bold text-lg text-[#3E2723] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </Field>

            <Field label="Email" icon={<Mail className="w-3 h-3" />}>
              <InlineEdit
                value={editData.email}
                onSave={(v) => updateContact({ email: v })}
                placeholder="name@example.com"
                className="font-body text-sm text-[#2B2118] cursor-pointer"
                inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </Field>
          </div>
        </div>

        {/* Right: WhatsApp */}
        <div className="p-5 sm:p-6 rounded-2xl bg-white border border-[#E8D8C3]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#F8F1E7] flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-[#5C3A2E]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#3E2723]">WhatsApp</h3>
              <p className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest">Fast booking</p>
            </div>
          </div>

          <div className="space-y-4">
            <Field label="WhatsApp Number" icon={<Hash className="w-3 h-3" />}>
              <InlineEdit
                value={editData.whatsapp}
                onSave={(v) => updateContact({ whatsapp: v })}
                placeholder="919043146394"
                className="font-body text-sm text-[#2B2118] cursor-pointer"
                inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
              <span className="font-body text-[10px] text-[#9CA3AF] mt-1 block">
                Country code + number, no spaces (e.g. 919043146394).
              </span>
            </Field>

            <Field label="Pre-filled Message" icon={<Send className="w-3 h-3" />}>
              <InlineEdit
                value={editData.whatsappMessage}
                onSave={(v) => updateContact({ whatsappMessage: v })}
                placeholder="Hi! I'd like to book an appointment…"
                multiline
                className="font-body text-sm text-[#2B2118] leading-relaxed cursor-pointer block whitespace-pre-wrap"
                inputClassName="w-full font-body text-sm text-[#2B2118] border border-[#5C3A2E] rounded px-3 py-2 outline-none resize-y"
              />
            </Field>

            {/* Preview */}
            <div className="pt-4 border-t border-[#E8D8C3]/70">
              <p className="font-body text-[9px] font-semibold uppercase tracking-widest text-[#9A6B52] mb-2">
                WhatsApp Link Preview
              </p>
              <div className="p-3 rounded-lg bg-[#FDFAF6] border border-[#E8D8C3]/60">
                <code className="font-body text-[11px] text-[#5C3A2E] break-all">
                  https://wa.me/{editData.whatsapp}?text={encodeURIComponent(editData.whatsappMessage)}
                </code>
              </div>
            </div>
          </div>
        </div>

        {/* Full width: Socials */}
        <div className="lg:col-span-2 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8D8C3]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-full bg-[#F8F1E7] flex items-center justify-center">
              <Globe className="w-4 h-4 text-[#5C3A2E]" />
            </div>
            <div>
              <h3 className="font-heading font-bold text-base text-[#3E2723]">Social Links</h3>
              <p className="font-body text-[10px] text-[#9CA3AF] uppercase tracking-widest">Instagram, Facebook, YouTube, Twitter</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Instagram" icon={<MessageCircle className="w-3 h-3" />}>
              <InlineEdit
                value={editData.social.instagram}
                onSave={(v) => updateContact({ social: { ...editData.social, instagram: v } })}
                placeholder="https://www.instagram.com/..."
                className="font-body text-xs text-[#7A6152] cursor-pointer truncate block"
                inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </Field>

            <Field label="Facebook" icon={<MessageCircle className="w-3 h-3" />}>
              <InlineEdit
                value={editData.social.facebook}
                onSave={(v) => updateContact({ social: { ...editData.social, facebook: v } })}
                placeholder="https://facebook.com/..."
                className="font-body text-xs text-[#7A6152] cursor-pointer truncate block"
                inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </Field>

            <Field label="YouTube" icon={<MessageCircle className="w-3 h-3" />}>
              <InlineEdit
                value={editData.social.youtube}
                onSave={(v) => updateContact({ social: { ...editData.social, youtube: v } })}
                placeholder="https://youtube.com/..."
                className="font-body text-xs text-[#7A6152] cursor-pointer truncate block"
                inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </Field>

            <Field label="Twitter / X" icon={<MessageCircle className="w-3 h-3" />}>
              <InlineEdit
                value={editData.social.twitter}
                onSave={(v) => updateContact({ social: { ...editData.social, twitter: v } })}
                placeholder="https://twitter.com/..."
                className="font-body text-xs text-[#7A6152] cursor-pointer truncate block"
                inputClassName="w-full font-body text-xs text-[#7A6152] border border-[#5C3A2E] rounded px-2 py-1 outline-none"
              />
            </Field>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
