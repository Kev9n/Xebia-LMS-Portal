import React, { useState, useEffect, useRef } from "react";
import { useAppStore } from "../../store/useAppStore";
import { CategoryService } from "@/services/api";
import { AIService } from "@/services/aiService";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Save,
  Plus,
  Smile,
  Link as LinkIcon,
  BookOpen,
  Users,
  X,
  Wand2,
  Loader2,
  AlertCircle,
  Tag,
  Palette,
  ToggleRight,
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import EmojiPicker from "emoji-picker-react";

const BRAND = "#6C1D5F";
const TEAL = "#01AC9F";
const PRESET_COLORS = ["#6C1D5F", "#01AC9F", "#FF6B35", "#845EC2", "#6C757D", "#4A90D9"];

function SectionCard({ children, accentFrom, accentTo, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
      className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500"
    >
      <div
        className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 z-50"
        style={{
          backgroundColor: accentFrom,
          backgroundImage: `linear-gradient(to right, ${accentFrom}, ${accentTo})`,
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none z-0"
        style={{ backgroundImage: `linear-gradient(135deg, ${accentFrom}, transparent)` }}
      />
      <div
        className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0"
        style={{ backgroundColor: `${accentFrom}30` }}
      />
      <div className="p-6 pt-7 relative z-10">{children}</div>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, label, required, iconColor }) {
  return (
    <div className="flex items-center gap-3 mb-5 group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/10 bg-white dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <label className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
    </div>
  );
}


function AIGenerateButton({ isGenerating, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-[#845EC2] to-[#D65DB1] text-white shadow-[0_4px_12px_-4px_rgba(214,93,177,0.4)] hover:shadow-[0_8px_20px_-6px_rgba(214,93,177,0.6)] hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group shrink-0"
      title="Generate with AI"
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
      <div className={clsx("relative z-10 transition-transform duration-500", !disabled && !isGenerating && "group-hover:rotate-12 group-hover:scale-110")}>
        {isGenerating ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Wand2 className="w-4 h-4" />
        )}
      </div>
      {!disabled && !isGenerating && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="absolute top-1 left-1.5 w-1 h-1 bg-white/80 rounded-full animate-ping" style={{ animationDuration: '1s' }} />
          <span className="absolute bottom-1 right-1.5 w-1 h-1 bg-white/80 rounded-full animate-ping" style={{ animationDuration: '1.2s', animationDelay: '0.2s' }} />
          <span className="absolute top-1.5 right-1 w-0.5 h-0.5 bg-white/80 rounded-full animate-ping" style={{ animationDuration: '0.8s', animationDelay: '0.4s' }} />
        </div>
      )}
    </button>
  );
}

export default function CreateCategory({ onBack, editData = null }) {
  const { addToast } = useAppStore();
  const [form, setForm] = useState({
    name: editData?.name || "",
    slug: editData?.slug || "",
    iconType:
      editData?.icon?.startsWith("http") || editData?.icon?.startsWith("blob:") ? "url" : "emoji",
    icon: editData?.icon || "",
    description: editData?.description || "",
    color: editData?.color || TEAL,
    active: editData?.active !== undefined ? editData.active : true,
  });
  const [saved, setSaved] = useState(false);
  const [autoSaveMsg, setAutoSaveMsg] = useState("Auto-saved");
  const [successBanner, setSuccessBanner] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [duplicateError, setDuplicateError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const colorInputRef = useRef(null);

  const generateAIDescription = async () => {
    if (!form.name.trim()) {
      addToast("Please enter a category name first", "error");
      return;
    }
    setIsGenerating(true);
    try {
      const desc = await AIService.generateCategoryDescription(form.name.trim());
      setForm({ ...form, description: desc });
      addToast("AI description generated successfully!", "success");
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!editData) {
      setForm((f) => ({
        ...f,
        slug: f.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
      }));
    }
  }, [form.name, editData]);
  useEffect(() => {
    if (form.name) {
      const t = setTimeout(() => setAutoSaveMsg("Auto-saved"), 1500);
      return () => clearTimeout(t);
    }
  }, [form]);

  const fieldSummary = [
    { label: "Name", value: form.name || "Web Development", ok: !!form.name },
    { label: "Icon", value: form.iconType === "emoji" ? "Emoji" : "Image URL", ok: true },
    {
      label: "Description",
      value: form.description ? "Filled" : "Not filled",
      ok: !!form.description,
    },
    { label: "Color", value: form.color.toUpperCase(), ok: true },
    { label: "Status", value: form.active ? "Active" : "Inactive", ok: true },
  ];

  const handleSubmit = async (asDraft = false) => {
    if (!form.name.trim() || !form.description.trim()) {
      setValidationError(
        "Please fill in all mandatory fields (Name and Description) before saving.",
      );
      return;
    }
    setIsSubmitting(true);
    try {
      const allCategories = await CategoryService.getCategories();
      const isDuplicate = allCategories.some(
        (c) =>
          (c.name || "").trim().toLowerCase() === form.name.trim().toLowerCase() &&
          c.id !== editData?.id,
      );
      if (isDuplicate) {
        setDuplicateError(form.name.trim());
        setIsSubmitting(false);
        return;
      }
      const payload = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        icon: form.icon,
        color: form.color,
        description: form.description,
        isActive: asDraft ? false : form.active,
      };
      if (editData?.id) {
        await CategoryService.updateCategory(editData.id, payload);
        addToast(`Category "${form.name}" updated!`, "success");
        if (onBack) onBack();
      } else {
        await CategoryService.createCategory(payload);
        setSuccessBanner(true);
        addToast(`Category "${form.name}" created!`, "success");
        if (!asDraft) {
          setSaved(true);
          if (onBack) onBack();
        }
      }
    } catch (err) {
      addToast(err.message || "Failed to save category", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-300 relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C1D5F]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#01AC9F]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <button
          onClick={onBack}
          className="hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
        >
          Dashboard
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <button
          onClick={onBack}
          className="hover:text-gray-800 dark:hover:text-white transition-colors font-medium"
        >
          Categories
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="text-gray-900 dark:text-white font-semibold">
          {editData ? "Edit" : "Create"}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/10 bg-white dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
            <LinkIcon className="w-7 h-7" style={{ color: form.color }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6C1D5F] to-[#01AC9F] tracking-tight">
              {editData ? "Edit Category" : "Create New Category"}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-sm">
              Fill in the details below to set up a new learning category.
            </p>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white dark:bg-[#15151f] text-gray-700 dark:text-gray-300 ring-1 ring-black/5 dark:ring-white/10 uppercase tracking-widest flex items-center gap-1.5 self-start sm:self-auto whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400 inline-block" /> Draft recovered
        </span>
      </motion.div>

      <AnimatePresence>
        {successBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex items-center justify-between bg-[#01AC9F] text-white rounded-2xl px-5 py-3.5 text-sm font-semibold mb-6 shadow-[0_8px_30px_-10px_rgba(1,172,159,0.5)]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" /> Category created successfully!
            </div>
            <button
              onClick={() => setSuccessBanner(false)}
              className="text-white/70 hover:text-white"
            >
              Dismiss
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="flex-1 min-w-0 flex flex-col gap-5" style={{ zoom: 0.9 }}>
          <SectionCard accentFrom="#6C1D5F" accentTo="#84117C" delay={0.05}>
            <SectionTitle icon={Tag} label="Category Name" required iconColor="#6C1D5F" />
            <input
              type="text"
              maxLength={100}
              placeholder="e.g. Web Development"
              value={form.name}
              onChange={(e) => {
                const n = e.target.value;
                setForm({
                  ...form,
                  name: n,
                  slug: n
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/(^-|-$)/g, ""),
                });
              }}
              className="w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/20 hover:border-[#6C1D5F]/50 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 backdrop-blur-sm"
            />
            {form.slug && (
              <p className="mt-3 text-[11px] font-mono text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#01AC9F] inline-block" />
                Slug: <span className="text-[#01AC9F]">{form.slug}</span>
              </p>
            )}
          </SectionCard>

          <SectionCard accentFrom="#01AC9F" accentTo="#4A90D9" delay={0.1}>
            <SectionTitle icon={Smile} label="Icon / Thumbnail" iconColor="#01AC9F" />
            <div className="flex gap-2 mb-5">
              {["emoji", "url"].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm({ ...form, iconType: type })}
                  className={clsx(
                    "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 hover:scale-105 hover:shadow-md",
                    form.iconType === type
                      ? "text-white shadow-sm"
                      : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 ring-1 ring-black/5 dark:ring-white/10",
                  )}
                  style={form.iconType === type ? { backgroundColor: TEAL } : {}}
                >
                  {type === "emoji" ? "Emoji" : "Image"}
                </button>
              ))}
            </div>

            {form.iconType === "emoji" ? (
              <div className="flex gap-4 relative">
                <div
                  className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-3xl shrink-0 bg-white/80 dark:bg-black/30 shadow-inner group-hover:scale-110 transition-transform duration-500 overflow-hidden"
                  style={{ borderColor: form.color }}
                >
                  <span className="truncate">{form.icon || "🏷️"}</span>
                </div>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    placeholder="Click to pick emoji"
                    value={form.icon}
                    onChange={(e) => setForm({ ...form, icon: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 rounded-xl text-sm outline-none focus:border-[#01AC9F] focus:ring-2 focus:ring-[#01AC9F]/20 pr-12 hover:border-[#01AC9F]/50 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 backdrop-blur-sm cursor-pointer"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#01AC9F] transition-colors"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-full right-0 z-50 mt-2 shadow-2xl rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1a24] overflow-hidden">
                      <EmojiPicker
                        onEmojiClick={(e) => {
                          setForm({ ...form, icon: e.emoji });
                          setShowEmojiPicker(false);
                        }}
                        theme="auto"
                        lazyLoadEmojis
                        searchDisabled={false}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <>
                <div
                  className="border-2 border-dashed border-gray-200 dark:border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-white/30 dark:bg-black/10 hover:border-[#01AC9F]/50 hover:bg-white/80 dark:hover:bg-black/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      const r = new FileReader();
                      r.onload = (ev) => setForm({ ...form, icon: ev.target.result });
                      r.readAsDataURL(file);
                    } else addToast("Please upload a valid image file.", "error");
                  }}
                >
                  {form.icon && form.icon.startsWith("data:image/") ? (
                    <div
                      className="relative group/preview rounded-full overflow-hidden w-24 h-24 border-2"
                      style={{ borderColor: form.color }}
                    >
                      <img
                        src={form.icon}
                        alt="Preview"
                        className="w-full h-full object-cover z-10 relative pointer-events-none"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity z-20">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm({ ...form, icon: "" });
                          }}
                          className="text-white bg-red-500 p-1.5 rounded-full pointer-events-auto hover:scale-110 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-2xl bg-[#01AC9F]/10 dark:bg-[#01AC9F]/20 flex items-center justify-center text-[#01AC9F] pointer-events-none group-hover:scale-110 transition-transform duration-500">
                        <Plus className="w-7 h-7" />
                      </div>
                      <div className="text-center pointer-events-none">
                        <p className="text-sm font-semibold text-gray-900 dark:text-white">
                          Drag and drop an image or click to upload
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          SVG, PNG, JPG or GIF (max. 2MB)
                        </p>
                      </div>
                    </>
                  )}
                  <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) {
                        const r = new FileReader();
                        r.onload = (ev) => setForm({ ...form, icon: ev.target.result });
                        r.readAsDataURL(f);
                      }
                    }}
                  />
                </div>
                <div className="w-full mt-5 flex items-center gap-3">
                  <div className="h-px bg-gray-200/60 dark:bg-white/10 flex-1" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    or url
                  </span>
                  <div className="h-px bg-gray-200/60 dark:bg-white/10 flex-1" />
                </div>
                <input
                  type="text"
                  placeholder="https://..."
                  value={form.icon && !form.icon.startsWith("data:image/") ? form.icon : ""}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 rounded-xl text-sm outline-none focus:border-[#01AC9F] focus:ring-2 focus:ring-[#01AC9F]/20 mt-4 hover:border-[#01AC9F]/50 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 relative z-10 backdrop-blur-sm"
                />
              </>
            )}
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
              Appears as the category thumbnail. Use simple, recognizable images or emojis.
            </p>
          </SectionCard>

          <SectionCard accentFrom="#84117C" accentTo="#6C1D5F" delay={0.15}>
            <div className="flex items-center justify-between mb-5">
              <SectionTitle icon={BookOpen} label="Description" required iconColor="#84117C" />
              <AIGenerateButton
                onClick={generateAIDescription}
                disabled={isGenerating || !form.name.trim()}
                isGenerating={isGenerating}
              />
            </div>
            <textarea
              rows={6}
              placeholder="Describe what this category covers..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:border-[#84117C] focus:ring-2 focus:ring-[#84117C]/20 hover:border-[#84117C]/50 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 resize-none backdrop-blur-sm"
            />
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
              No character limit. Appears in category listings and SEO previews.
            </p>
          </SectionCard>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <SectionCard accentFrom="#FF6B35" accentTo="#845EC2" delay={0.2}>
              <SectionTitle icon={Palette} label="Accent Color" iconColor="#FF6B35" />
              <div className="flex items-center gap-3 border border-gray-200/60 dark:border-white/10 rounded-xl px-4 py-3 bg-white/60 dark:bg-black/20 mb-4 hover:bg-white dark:hover:bg-black/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
                <input
                  type="color"
                  ref={colorInputRef}
                  value={form.color}
                  onChange={(e) => setForm({ ...form, color: e.target.value })}
                  className="w-9 h-9 rounded-full cursor-pointer border-0 bg-transparent p-0 hover:scale-110 transition-transform"
                />
                <div className="flex items-center gap-1.5 text-sm font-mono text-gray-700 dark:text-gray-300">
                  <span className="text-gray-400 dark:text-gray-500">#</span>
                  <span className="uppercase">{form.color.replace("#", "")}</span>
                </div>
              </div>
              <div className="flex gap-2.5 flex-wrap">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    onClick={() => setForm({ ...form, color: c })}
                    className={clsx(
                      "w-8 h-8 rounded-full transition-all hover:scale-125 shadow-sm hover:shadow-md",
                      form.color === c &&
                        "ring-2 ring-offset-2 ring-gray-400 dark:ring-gray-500 scale-110",
                    )}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-5">
                Used for badges and highlights.
              </p>
            </SectionCard>

            <SectionCard accentFrom="#01AC9F" accentTo="#4A90D9" delay={0.22}>
              <SectionTitle icon={ToggleRight} label="Status" iconColor="#01AC9F" />
              <div
                className="flex items-center gap-4 cursor-pointer select-none mb-4 group/status"
                onClick={() => setForm({ ...form, active: !form.active })}
              >
                <div
                  className={clsx(
                    "relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner group-hover/status:shadow-md",
                    form.active ? "bg-[#01AC9F]" : "bg-gray-200 dark:bg-gray-700",
                  )}
                >
                  <div
                    className={clsx(
                      "w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 group-hover/status:scale-110",
                      form.active ? "translate-x-7" : "translate-x-0",
                    )}
                  />
                </div>
                <span
                  className={clsx(
                    "text-sm font-bold transition-colors",
                    form.active ? "text-[#01AC9F]" : "text-gray-500 dark:text-gray-400",
                  )}
                >
                  {form.active ? "Active" : "Inactive"}
                </span>
              </div>
              <div
                className={clsx(
                  "rounded-xl px-4 py-3 text-xs flex items-center gap-2 font-medium transition-all duration-300 hover:shadow-md hover:-translate-y-0.5",
                  form.active
                    ? "bg-[#01AC9F]/10 text-[#01AC9F] ring-1 ring-[#01AC9F]/20 hover:bg-[#01AC9F]/20"
                    : "bg-gray-100/60 dark:bg-white/5 text-gray-500 dark:text-gray-400 ring-1 ring-black/5 dark:ring-white/10 hover:bg-gray-200/60 dark:hover:bg-white/10",
                )}
              >
                <span
                  className={clsx(
                    "w-2 h-2 rounded-full shrink-0 transition-colors duration-300",
                    form.active ? "bg-[#01AC9F]" : "bg-gray-400",
                  )}
                />
                {form.active ? "Visible to all learners" : "Inactive - hidden from learners."}
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4">
                {form.active
                  ? "Inactive categories are hidden from learners."
                  : "Enable to make this category visible."}
              </p>
            </SectionCard>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.28 }}
            whileHover={{ y: -4, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500"
          >
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium">
              <Save className="w-3.5 h-3.5" />
              {autoSaveMsg}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={onBack}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white/60 dark:bg-black/20"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(true)}
                disabled={isSubmitting}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 bg-white/60 dark:bg-black/20"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={() => handleSubmit(false)}
                disabled={isSubmitting || !form.name.trim()}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 shadow-[0_4px_20px_-5px_rgba(108,29,95,0.5)] hover:shadow-[0_8px_30px_-5px_rgba(108,29,95,0.8)] hover:-translate-y-1 hover:scale-105"
                style={{ background: "linear-gradient(135deg, #6C1D5F, #84117C, #01AC9F)" }}
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {editData ? "Update Category" : "Create Category"}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5 self-start lg:sticky lg:top-8 z-10">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -6, x: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500"
          >
            <div
              className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 z-50"
              style={{
                backgroundColor: form.color,
                backgroundImage: `linear-gradient(to right, ${form.color}, #01AC9F)`,
              }}
            />
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-0"
              style={{ backgroundImage: `linear-gradient(135deg, ${form.color}40, transparent)` }}
            />
            <div className="px-5 py-4 border-b border-gray-200/50 dark:border-white/10 flex items-center gap-2 relative z-10">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: form.color }} />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                Live Preview
              </p>
            </div>
            <div className="p-4 relative z-10">
              <div
                className="bg-white dark:bg-[#15151f] rounded-xl overflow-hidden relative flex flex-col shadow-sm group-hover:shadow-xl transition-shadow duration-500"
                style={{ border: `2px solid ${form.color}` }}
              >
                <div
                  className="w-full aspect-video shrink-0 overflow-hidden relative flex items-center justify-center group/img"
                  style={{
                    backgroundColor:
                      form.iconType === "url" && form.icon ? "var(--tw-bg-opacity)" : form.color,
                  }}
                >
                  {form.iconType === "url" && form.icon ? (
                    <img
                      src={form.icon}
                      alt=""
                      className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700"
                    />
                  ) : form.iconType === "emoji" && form.icon ? (
                    <span className="text-[120px] leading-none absolute flex items-center justify-center w-full h-full group-hover/img:scale-110 transition-transform duration-700 truncate px-4">
                      {form.icon}
                    </span>
                  ) : null}
                  <div className="absolute top-3 right-3">
                    <span
                      className={clsx(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm",
                        form.active ? "bg-green-500 text-white" : "bg-red-500 text-white",
                      )}
                    >
                      {form.active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4 pt-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-[14px]">
                    {form.name || "Web Development"}
                  </h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono mt-0.5">
                    {form.slug || "web-development"}
                  </p>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {form.description ||
                      "Learn the fundamentals of building modern web applications."}
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-white/10 mt-3">
                    <span className="flex items-center gap-1">
                      <span
                        className="w-2 h-2 rounded-full inline-block"
                        style={{ backgroundColor: form.color }}
                      />
                      {form.color.toUpperCase()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> 0 Courses
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3 h-3" /> 0
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.17 }}
            whileHover={{ y: -6, x: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500"
          >
            <div className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 bg-gradient-to-r from-[#01AC9F] to-[#4A90D9] z-50" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#01AC9F]40 to-transparent z-0" />
            <div className="p-5 pt-6 relative z-10">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">
                Field Summary
              </p>
              <div className="space-y-3">
                {fieldSummary.map(({ label, value, ok }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">
                      {label}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span
                        className={clsx(
                          "font-semibold text-xs",
                          ok ? "text-gray-900 dark:text-white" : "text-red-400",
                        )}
                      >
                        {value}
                      </span>
                      {ok ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#01AC9F]" />
                      ) : (
                        <Circle className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.22 }}
            whileHover={{ y: -6, x: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500"
          >
            <div className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 bg-gradient-to-r from-amber-400 to-orange-400 z-50" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-amber-400/40 to-transparent z-0" />
            <div className="p-5 pt-6 bg-amber-50/50 dark:bg-amber-900/5 relative z-10">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-3">
                Quick Tips
              </p>
              <ul className="space-y-2 text-xs text-amber-700 dark:text-amber-400/80">
                {[
                  "Use a clear, descriptive name",
                  "Pick a brand-aligned accent color",
                  "Write a short SEO-friendly description",
                  "Keep inactive until content is ready",
                ].map((tip) => (
                  <li
                    key={tip}
                    className="flex items-start gap-1.5 group-hover:translate-x-1 transition-transform duration-300"
                  >
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 mt-auto px-1 group hover:text-gray-700 dark:hover:text-gray-300 transition-colors cursor-pointer">
            <div
              className="w-6 h-6 rounded-lg flex items-center justify-center group-hover:rotate-12 transition-transform duration-500"
              style={{ backgroundColor: BRAND }}
            >
              <span className="text-white font-black text-[9px]">X</span>
            </div>
            <span>Xebia LMS Admin</span>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {duplicateError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-strong !border-0 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[6px] bg-red-500" />
              <div className="p-7 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <X className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Duplicate Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-7 text-sm">
                  A category named{" "}
                  <span className="font-semibold text-gray-800 dark:text-gray-200">
                    "{duplicateError}"
                  </span>{" "}
                  already exists.
                </p>
                <button
                  onClick={() => setDuplicateError(null)}
                  className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Okay, I'll change it
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {validationError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-strong !border-0 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative"
            >
              <div className="absolute top-0 left-0 w-full h-[6px] bg-red-500" />
              <div className="p-7 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Missing Fields
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-7 text-sm">{validationError}</p>
                <button
                  onClick={() => setValidationError(null)}
                  className="w-full py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:bg-gray-800 transition-colors"
                >
                  Okay, I'll fill them
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
