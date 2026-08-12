import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import { CourseService } from "@/services/api";
import { AIService } from "@/services/aiService";
import {
  CheckCircle2,
  Circle,
  ChevronRight,
  Save,
  Check,
  AlertCircle,
  Plus,
  X,
  Wand2,
  Loader2,
  Globe,
  Clock,
  BookOpen,
  Tag,
  Image as ImageIcon,
  Settings,
  List,
  Users
} from "lucide-react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";

const BRAND = "#6C1D5F";
const TEAL = "#01AC9F";

const LANGUAGES = ["English", "Hindi", "Spanish", "French", "German", "Japanese", "Chinese"];
const LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

function SectionCard({ children, accentFrom, accentTo, delay = 0 }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }} 
      whileHover={{ y: -6, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
      className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500">
      <div 
        className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 z-50" 
        style={{ backgroundColor: accentFrom, backgroundImage: `linear-gradient(to right, ${accentFrom}, ${accentTo})` }} 
      />
      <div className="absolute inset-0 opacity-[0.04] group-hover:opacity-[0.08] transition-opacity duration-500 pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(135deg, ${accentFrom}, transparent)` }} />
      <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-0" style={{ backgroundColor: `${accentFrom}30` }} />
      <div className="p-6 pt-7 relative z-10">{children}</div>
    </motion.div>
  );
}

function SectionTitle({ icon: Icon, label, required, iconColor }) {
  return (
    <div className="flex items-center gap-3 mb-6 group-hover:transform group-hover:translate-x-1 transition-transform duration-300">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-100 dark:border-white/10 bg-white dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.3)]">
        <Icon className="w-5 h-5" style={{ color: iconColor }} />
      </div>
      <label className="text-base font-extrabold text-gray-900 dark:text-white tracking-tight">{label} {required && <span className="text-red-500">*</span>}</label>
    </div>
  );
}

function FormRow({ children, cols = 2 }) {
  const colClass = cols === 1 ? "sm:grid-cols-1" : cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return <div className={`grid grid-cols-1 ${colClass} gap-5`}>{children}</div>;
}

function Field({ label, required, hint, children }) {
  return (
    <div className="mb-2">
      <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1.5 uppercase tracking-wider">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 font-medium">{hint}</p>}
    </div>
  );
}

function Input({ ...props }) {
  return (
    <input
      {...props}
      className={clsx(
        "w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/20 hover:border-[#6C1D5F]/50 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 backdrop-blur-sm",
        props.className,
      )}
    />
  );
}

function Textarea({ ...props }) {
  return (
    <textarea
      {...props}
      className={clsx(
        "w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 rounded-xl text-sm outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/20 hover:border-[#6C1D5F]/50 hover:bg-white dark:hover:bg-black/40 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300 resize-none backdrop-blur-sm",
        props.className,
      )}
    />
  );
}

function Select({ children, ...props }) {
  return (
    <div className="relative hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300">
      <select
        {...props}
        className={clsx(
          "w-full px-4 py-3 border border-gray-200/60 dark:border-white/10 bg-white/80 dark:bg-black/20 text-gray-900 dark:text-white rounded-xl text-sm outline-none focus:border-[#6C1D5F] focus:ring-2 focus:ring-[#6C1D5F]/20 hover:border-[#6C1D5F]/50 appearance-none backdrop-blur-sm cursor-pointer",
          props.className,
        )}
      >
        {children}
      </select>
      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none rotate-90" />
    </div>
  );
}

function Toggle({ checked, onChange, label, hint }) {
  return (
    <div className="flex items-start gap-4 cursor-pointer group/status" onClick={() => onChange(!checked)}>
      <div className={clsx("relative w-14 h-7 rounded-full transition-all duration-300 flex items-center px-1 shadow-inner group-hover/status:shadow-md shrink-0 mt-0.5", checked ? "bg-[#01AC9F]" : "bg-gray-200 dark:bg-gray-700")}>
        <div className={clsx("w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 group-hover/status:scale-110", checked ? "translate-x-7" : "translate-x-0")} />
      </div>
      <div>
        <span className={clsx("text-sm font-bold transition-colors", checked ? "text-[#01AC9F]" : "text-gray-500 dark:text-gray-400")}>{label}</span>
        {hint && <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1 font-medium">{hint}</p>}
      </div>
    </div>
  );
}

function ListEditor({ items, onChange, placeholder }) {
  const add = () => onChange([...items, ""]);
  const update = (i, v) => onChange(items.map((x, idx) => (idx === i ? v : x)));
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div className="space-y-3">
      <AnimatePresence>
      {items.map((item, i) => (
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} key={i} className="flex items-center gap-3 group">
          <span className="w-8 h-8 rounded-xl bg-white/60 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-gray-500 dark:text-gray-400 text-xs font-bold flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
            {i + 1}
          </span>
          <Input
            value={item}
            onChange={(e) => update(i, e.target.value)}
            placeholder={placeholder}
          />
          <button
            type="button"
            onClick={() => remove(i)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all shrink-0 hover:scale-110 opacity-0 group-hover:opacity-100 shadow-sm"
          >
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
      </AnimatePresence>
      <button
        type="button"
        onClick={add}
        className="flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl border border-dashed border-gray-300 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:border-[#6C1D5F] hover:text-[#6C1D5F] hover:bg-[#6C1D5F]/5 dark:hover:bg-[#6C1D5F]/10 transition-all hover:-translate-y-0.5 hover:shadow-md"
      >
        <Plus className="w-4 h-4" /> Add Item
      </button>
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

function BasicDetailsStep({ form, setForm, categories, generatingField, handleAIGenerate }) {
  return (
    <div className="space-y-6">
      <SectionCard accentFrom="#6C1D5F" accentTo="#84117C" delay={0.05}>
        <SectionTitle icon={BookOpen} label="Course Identity" required iconColor="#6C1D5F" />
        <div className="space-y-5">
          <FormRow cols={1}>
            <Field label="Title" required hint="Appears on the course card and listing pages.">
              <div className="flex items-center gap-2 mb-3">
                <AIGenerateButton onClick={() => handleAIGenerate("title", AIService.generateCourseTitle)} disabled={generatingField === "title" || !form.title.trim()} isGenerating={generatingField === "title"} />
              </div>
              <div className="relative">
                <Input
                  value={form.title}
                  onChange={(e) => {
                    const newTitle = e.target.value;
                    const generatedSlug = newTitle
                      .toLowerCase()
                      .replace(/[^a-z0-9]+/g, "-")
                      .replace(/(^-|-$)/g, "");
                    setForm((f) => ({ ...f, title: newTitle, slug: generatedSlug }));
                  }}
                  placeholder="Type a topic (e.g. Java) and hit 'Generate with AI', or enter full title."
                  maxLength={100}
                />
                {form.title && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] text-[#01AC9F] font-bold flex items-center gap-1 bg-[#01AC9F]/10 px-2 py-0.5 rounded-md">
                    <Check className="w-3 h-3" /> Unique
                  </span>
                )}
              </div>
            </Field>
          </FormRow>

          <FormRow>
            <Field label="Category" required>
              <Select
                value={form.categoryId}
                onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
              >
                <option value="">Select a Category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Level" required>
              <Select
                value={form.level}
                onChange={(e) => setForm((f) => ({ ...f, level: e.target.value }))}
              >
                {LEVELS.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>
          </FormRow>

          <FormRow>
            <Field label="Language / Locale">
              <Select
                value={form.language}
                onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
              >
                {LANGUAGES.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </Select>
            </Field>
            <Field label="Duration" required hint="Hours and Minutes">
              <div className="flex items-center gap-3">
                <div className="flex-1 relative group hover:shadow-lg transition-shadow rounded-xl">
                  <Input
                    value={form.durationHours}
                    onChange={(e) => setForm((f) => ({ ...f, durationHours: e.target.value }))}
                    placeholder="0"
                    type="number"
                    min="0"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 group-hover:text-[#6C1D5F] transition-colors pointer-events-none">
                    hrs
                  </span>
                </div>
                <div className="flex-1 relative group hover:shadow-lg transition-shadow rounded-xl">
                  <Input
                    value={form.durationMinutes}
                    onChange={(e) => setForm((f) => ({ ...f, durationMinutes: e.target.value }))}
                    placeholder="0"
                    type="number"
                    min="0"
                    max="59"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400 group-hover:text-[#6C1D5F] transition-colors pointer-events-none">
                    min
                  </span>
                </div>
              </div>
            </Field>
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard accentFrom="#01AC9F" accentTo="#4A90D9" delay={0.1}>
        <SectionTitle icon={Tag} label="Descriptions" iconColor="#01AC9F" />
        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <Field label="Short Description" required hint="A short, catchy tagline (max 200 chars)." />
              <AIGenerateButton onClick={() =>
                  handleAIGenerate("shortDescription", AIService.generateBriefDescription)
                } disabled={generatingField === "shortDescription" || !form.title.trim()} isGenerating={generatingField === "shortDescription"} />
            </div>
            <Textarea
              value={form.shortDescription}
              onChange={(e) => setForm((f) => ({ ...f, shortDescription: e.target.value }))}
              rows={2}
              placeholder="A brief description of what this course covers..."
              maxLength={200}
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <Field label="Full Description" required hint="Detailed overview. Supports markdown." />
              <AIGenerateButton onClick={() => handleAIGenerate("description", AIService.generateFullDescription)} disabled={generatingField === "description" || !form.title.trim()} isGenerating={generatingField === "description"} />
            </div>
            <Textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={5}
              placeholder="Full course description..."
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard accentFrom="#FF6B35" accentTo="#845EC2" delay={0.15}>
        <SectionTitle icon={ImageIcon} label="Media" iconColor="#FF6B35" />
        <div className="space-y-6">
          <FormRow cols={3}>
            <Field label="Icon" hint="Course Icon (Drag or URL)">
              <div
                className="mt-2 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-white/30 dark:bg-black/10 hover:border-[#FF6B35]/50 hover:bg-white/80 dark:hover:bg-black/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => setForm((f) => ({ ...f, icon: reader.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 dark:bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] group-hover:scale-110 transition-transform duration-500">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center pointer-events-none">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">
                    Drag & drop or click
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setForm((f) => ({ ...f, icon: reader.result }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <Input
                  value={form.icon && !form.icon.startsWith("blob:") ? form.icon : ""}
                  onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
                  placeholder="URL https://..."
                />
              </div>
            </Field>

            <Field label="Thumbnail Image" hint="Course Thumbnail (Drag or URL)">
              <div
                className="mt-2 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-white/30 dark:bg-black/10 hover:border-[#FF6B35]/50 hover:bg-white/80 dark:hover:bg-black/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => setForm((f) => ({ ...f, thumbnail: reader.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 dark:bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] group-hover:scale-110 transition-transform duration-500">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center pointer-events-none">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">
                    Drag & drop or click
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setForm((f) => ({ ...f, thumbnail: reader.result }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <Input
                  value={
                    form.thumbnail && !form.thumbnail.startsWith("blob:") ? form.thumbnail : ""
                  }
                  onChange={(e) => setForm((f) => ({ ...f, thumbnail: e.target.value }))}
                  placeholder="URL https://..."
                />
              </div>
            </Field>

            <Field label="Banner Image" hint="Course Banner (Drag or URL)">
              <div
                className="mt-2 border-2 border-dashed border-gray-300 dark:border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 bg-white/30 dark:bg-black/10 hover:border-[#FF6B35]/50 hover:bg-white/80 dark:hover:bg-black/40 hover:-translate-y-1 hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-pointer"
                onDragOver={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  const file = e.dataTransfer.files?.[0];
                  if (file && file.type.startsWith("image/")) {
                    const reader = new FileReader();
                    reader.onloadend = () => setForm((f) => ({ ...f, bannerImage: reader.result }));
                    reader.readAsDataURL(file);
                  }
                }}
              >
                <div className="w-12 h-12 rounded-xl bg-[#FF6B35]/10 dark:bg-[#FF6B35]/20 flex items-center justify-center text-[#FF6B35] group-hover:scale-110 transition-transform duration-500">
                  <Plus className="w-6 h-6" />
                </div>
                <div className="text-center pointer-events-none">
                  <p className="text-[11px] font-bold text-gray-900 dark:text-white">
                    Drag & drop or click
                  </p>
                </div>
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () =>
                        setForm((f) => ({ ...f, bannerImage: reader.result }));
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
              <div className="mt-3">
                <Input
                  value={
                    form.bannerImage && !form.bannerImage.startsWith("blob:")
                      ? form.bannerImage
                      : ""
                  }
                  onChange={(e) => setForm((f) => ({ ...f, bannerImage: e.target.value }))}
                  placeholder="URL https://..."
                />
              </div>
            </Field>
          </FormRow>
        </div>
      </SectionCard>

      <SectionCard accentFrom="#845EC2" accentTo="#6C1D5F" delay={0.2}>
        <SectionTitle icon={List} label="Additional Information" iconColor="#845EC2" />
        <div className="space-y-6">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
              <Field label="Learning Outcomes" hint="What students will learn" />
              <AIGenerateButton onClick={() =>
                  handleAIGenerate("learningOutcomes", AIService.generateLearningOutcomes)
                } disabled={generatingField === "learningOutcomes" || !form.title.trim()} isGenerating={generatingField === "learningOutcomes"} />
            </div>
            <ListEditor
              items={form.learningOutcomes}
              onChange={(v) => setForm((f) => ({ ...f, learningOutcomes: v }))}
              placeholder="e.g. Build REST APIs with Spring Boot"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 mt-4">
              <Field label="Prerequisites" hint="Optional" />
              <AIGenerateButton onClick={() => handleAIGenerate("prerequisites", AIService.generatePrerequisites)} disabled={generatingField === "prerequisites" || !form.title.trim()} isGenerating={generatingField === "prerequisites"} />
            </div>
            <ListEditor
              items={form.prerequisites}
              onChange={(v) => setForm((f) => ({ ...f, prerequisites: v }))}
              placeholder="e.g. Basic Java knowledge"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 mt-4">
              <Field label="Target Audience" hint="Optional" />
              <AIGenerateButton onClick={() => handleAIGenerate("targetAudience", AIService.generateTargetAudience)} disabled={generatingField === "targetAudience" || !form.title.trim()} isGenerating={generatingField === "targetAudience"} />
            </div>
            <ListEditor
              items={form.targetAudience}
              onChange={(v) => setForm((f) => ({ ...f, targetAudience: v }))}
              placeholder="e.g. Backend developers who want to learn Spring Boot"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 mt-4">
              <Field label="Course Highlights (max 10)" hint="Optional" />
              <AIGenerateButton onClick={() => handleAIGenerate("highlights", AIService.generateCourseHighlights)} disabled={generatingField === "highlights" || !form.title.trim()} isGenerating={generatingField === "highlights"} />
            </div>
            <ListEditor
              items={form.highlights}
              onChange={(v) => setForm((f) => ({ ...f, highlights: v }))}
              placeholder="Key highlights (e.g. 3 Real-world projects)"
            />
          </div>

          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2 mt-4">
              <Field label="Career Opportunities (max 5)" hint="Optional" />
              <AIGenerateButton onClick={() =>
                  handleAIGenerate("careerOpportunities", AIService.generateCareerOpportunities)
                } disabled={generatingField === "careerOpportunities" || !form.title.trim()} isGenerating={generatingField === "careerOpportunities"} />
            </div>
            <ListEditor
              items={form.careerOpportunities}
              onChange={(v) => setForm((f) => ({ ...f, careerOpportunities: v }))}
              placeholder="e.g. Backend Developer, Cloud Engineer"
            />
          </div>
        </div>
      </SectionCard>

      <SectionCard accentFrom="#01AC9F" accentTo="#FF6B35" delay={0.25}>
        <SectionTitle icon={Settings} label="Course Settings" iconColor="#01AC9F" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <Toggle
            checked={form.active}
            onChange={(v) => setForm((f) => ({ ...f, active: v }))}
            label="Active"
            hint="Makes the course visible to learners"
          />
          <Toggle
            checked={form.isPublished}
            onChange={(v) => setForm((f) => ({ ...f, isPublished: v }))}
            label="Published"
            hint="Publish the course now"
          />
          <Toggle
            checked={form.isFeatured}
            onChange={(v) => setForm((f) => ({ ...f, isFeatured: v }))}
            label="Featured"
            hint="Show in featured section"
          />
          <Toggle
            checked={form.allowEnrolling}
            onChange={(v) => setForm((f) => ({ ...f, allowEnrolling: v }))}
            label="Allow Enrolling"
            hint="Allow new enrollments"
          />
          <Toggle
            checked={form.showOnCourse}
            onChange={(v) => setForm((f) => ({ ...f, showOnCourse: v }))}
            label="Show on Listing"
            hint="Show on course listing"
          />
        </div>
      </SectionCard>
    </div>
  );
}

export default function CreateCourse({ editData, categories = [], onBack, onSaved }) {
  const { addToast } = useAppStore();
  const [isSaving, setIsSaving] = useState(false);
  const [generatingField, setGeneratingField] = useState(null);
  const [duplicateError, setDuplicateError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  const handleAIGenerate = async (field, generatorFn) => {
    if (!form.title.trim()) {
      addToast("Please enter a course title first", "error");
      return;
    }
    const cat = categories.find((c) => String(c.id) === String(form.categoryId));
    const categoryName = cat ? cat.name : "General";
    setGeneratingField(field);
    try {
      let result = await generatorFn(form.title.trim(), categoryName, form.level);
      if (field === "title") {
        const generatedSlug = result
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
        setForm((f) => ({ ...f, title: result, slug: generatedSlug }));
      } else {
        setForm((f) => ({ ...f, [field]: result }));
      }
      addToast(`AI generated successfully!`, "success");
    } catch (e) {
      addToast(e.message, "error");
    } finally {
      setGeneratingField(null);
    }
  };

  const parseDuration = (durStr) => {
    if (!durStr) return { h: "", m: "" };
    const hMatch = durStr.match(/(\d+)\s*(h|hrs|hours)/i);
    const mMatch = durStr.match(/(\d+)\s*(m|min|mins)/i);
    return { h: hMatch ? hMatch[1] : "", m: mMatch ? mMatch[1] : "" };
  };

  const [form, setForm] = useState({
    title: editData?.title || "",
    categoryId: editData?.categoryId || "",
    level:
      LEVELS.find(
        (l) =>
          l.toLowerCase() === (editData?.difficultyLevel || editData?.level || "").toLowerCase(),
      ) || "Beginner",
    language: editData?.language || "English",
    durationHours:
      editData?.durationHours || (editData?.duration ? parseDuration(editData.duration).h : ""),
    durationMinutes:
      editData?.durationMinutes || (editData?.duration ? parseDuration(editData.duration).m : ""),
    shortDescription: editData?.shortDescription || editData?.subtitle || "",
    description: editData?.description || "",
    icon: editData?.icon || "",
    thumbnail: editData?.thumbnail || editData?.thumbnailImageUrl || "",
    bannerImage: editData?.bannerImage || editData?.promoImageUrl || "",
    learningOutcomes: editData?.learningOutcomes || [""],
    prerequisites: editData?.prerequisites || [""],
    targetAudience: editData?.targetAudience || [""],
    highlights: Array.isArray(editData?.highlights)
      ? editData.highlights
      : editData?.highlights
        ? editData.highlights.split("\n").filter(Boolean)
        : [""],
    careerOpportunities: Array.isArray(editData?.careerOpportunities)
      ? editData.careerOpportunities
      : editData?.careerOpportunities
        ? editData.careerOpportunities.split("\n").filter(Boolean)
        : [""],
    active: editData?.isActive !== false && editData?.active !== false,
    isPublished: editData?.published || editData?.isPublished || false,
    isFeatured: editData?.isFeatured || false,
    allowEnrolling: editData?.allowEnrolling !== false,
    showOnCourse: editData?.showOnCourse !== false,
  });

  const handleSave = async (asDraft = false) => {
    if (
      !form.title?.trim() ||
      !form.categoryId ||
      !form.durationHours ||
      !form.level ||
      !form.shortDescription?.trim() ||
      !form.description?.trim()
    ) {
      setValidationError(
        "Please fill in all mandatory fields (Title, Duration, Category, Level, and both Descriptions) before saving.",
      );
      return;
    }
    setIsSaving(true);
    try {
      const allCourses = await CourseService.getCourses();
      const isDuplicate = allCourses.some(
        (c) =>
          (c.title || "").trim().toLowerCase() === form.title.trim().toLowerCase() &&
          String(c.categoryId) === String(form.categoryId) &&
          (c.difficultyLevel || c.level || "Beginner").toLowerCase() === form.level.toLowerCase() &&
          c.id !== editData?.id,
      );
      if (isDuplicate) {
        setDuplicateError(form.title.trim());
        setIsSaving(false);
        return;
      }

      const payload = {
        title: form.title,
        courseCode: form.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        categoryId: form.categoryId,
        level: form.level,
        language: form.language,
        duration:
          form.durationHours && form.durationMinutes
            ? `${form.durationHours}h ${form.durationMinutes}m`
            : form.durationHours
              ? `${form.durationHours} hrs`
              : "",
        durationHours: parseInt(form.durationHours) || 0,
        durationMinutes: parseInt(form.durationMinutes) || 0,
        shortDescription: form.shortDescription,
        description: form.description,
        icon: form.icon,
        thumbnail: form.thumbnail,
        bannerImage: form.bannerImage,
        published: asDraft ? false : true,
        active: form.active,
        isActive: form.active,
        isFeatured: form.isFeatured,
        allowEnrolling: form.allowEnrolling,
        learningOutcomes: form.learningOutcomes.filter(Boolean),
        prerequisites: form.prerequisites.filter(Boolean),
        targetAudience: form.targetAudience.filter(Boolean),
        highlights: form.highlights.filter(Boolean),
        careerOpportunities: form.careerOpportunities.filter(Boolean),
      };

      let result;
      if (editData?.id) {
        result = await CourseService.updateCourse(editData.id, payload);
        addToast(`Course "${form.title}" updated!`, "success");
      } else {
        result = await CourseService.createCourse(payload);
        addToast(`Course "${form.title}" created!`, "success");
      }
      if (onSaved) onSaved(result);
      else onBack();
    } catch (err) {
      addToast(err.message || "Failed to save course.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const selectedCat = categories.find((c) => String(c.id) === String(form.categoryId));

  return (
    <div className="min-h-screen flex flex-col animate-in fade-in duration-300 relative">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#6C1D5F]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-[#01AC9F]/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      
      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-8">
        <button onClick={onBack} className="hover:text-gray-800 dark:hover:text-white transition-colors font-medium">Dashboard</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <button onClick={onBack} className="hover:text-gray-800 dark:hover:text-white transition-colors font-medium">Courses</button>
        <ChevronRight className="w-3.5 h-3.5 opacity-50" />
        <span className="text-gray-900 dark:text-white font-semibold">{editData ? "Edit" : "Create"}</span>
      </div>
      
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 dark:border-white/10 bg-white dark:bg-black/30 shadow-[inset_0_1px_2px_rgba(255,255,255,0.4)]">
             <BookOpen className="w-7 h-7" style={{ color: BRAND }} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#6C1D5F] to-[#01AC9F] tracking-tight">{editData ? "Edit Course" : "Create New Course"}</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1 text-sm">Establish course name, content, level and prerequisites.</p>
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1">
        <div className="flex-1 min-w-0 flex flex-col gap-5" style={{ zoom: 0.9 }}>
          <BasicDetailsStep
            form={form}
            setForm={setForm}
            categories={categories}
            generatingField={generatingField}
            handleAIGenerate={handleAIGenerate}
          />
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }} 
            whileHover={{ y: -4, boxShadow: "0 15px 30px -10px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-500 mt-2">
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium"><Save className="w-3.5 h-3.5" />Auto-saving enabled</div>
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <button type="button" onClick={onBack} className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 bg-white/60 dark:bg-black/20">Cancel</button>
              <button type="button" onClick={() => handleSave(true)} disabled={isSaving} className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-sm font-semibold border border-gray-200/60 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-60 bg-white/60 dark:bg-black/20">Save as Draft</button>
              <button type="button" onClick={() => handleSave(false)} disabled={isSaving || !form.title?.trim()} className="w-full sm:w-auto px-6 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60 shadow-[0_4px_20px_-5px_rgba(108,29,95,0.5)] hover:shadow-[0_8px_30px_-5px_rgba(108,29,95,0.8)] hover:-translate-y-1 hover:scale-105" style={{ background: "linear-gradient(135deg, #6C1D5F, #84117C, #01AC9F)" }}>
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {editData ? "Update Course" : "Create Course"}
              </button>
            </div>
          </motion.div>
        </div>

        <div className="w-full lg:w-72 shrink-0 flex flex-col gap-5 self-start lg:sticky lg:top-8 z-10">
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.1 }} 
            whileHover={{ y: -6, x: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 z-50" style={{ backgroundColor: BRAND, backgroundImage: `linear-gradient(to right, ${BRAND}, ${TEAL})` }} />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none z-0" style={{ backgroundImage: `linear-gradient(135deg, ${BRAND}40, transparent)` }} />
            <div className="px-5 py-4 border-b border-gray-200/50 dark:border-white/10 flex items-center gap-2 relative z-10">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: BRAND }} />
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest">Live Preview</p>
            </div>
            <div className="p-4 relative z-10">
              <div className="bg-white dark:bg-[#15151f] rounded-xl overflow-hidden relative flex flex-col shadow-sm group-hover:shadow-xl transition-shadow duration-500 border-2" style={{ borderColor: BRAND }}>
                <div className="w-full aspect-video shrink-0 overflow-hidden relative flex items-center justify-center group/img bg-gray-100 dark:bg-gray-800">
                  {form.thumbnail ? (
                    <img src={form.thumbnail} alt="" className="w-full h-full object-cover group-hover/img:scale-110 transition-transform duration-700" />
                  ) : (
                    <span className="text-[50px] leading-none absolute flex items-center justify-center w-full h-full text-gray-300 dark:text-gray-600 font-bold uppercase opacity-30">{form.title ? form.title.substring(0, 2) : "CO"}</span>
                  )}
                  <div className="absolute top-3 right-3 flex flex-col gap-1.5 items-end">
                    <span className={clsx("text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm", form.isPublished ? "bg-purple-600 text-white" : "bg-amber-500 text-white")}>{form.isPublished ? "Published" : "Draft"}</span>
                    <span className={clsx("text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm", form.active ? "bg-green-500 text-white" : "bg-red-500 text-white")}>{form.active ? "Active" : "Inactive"}</span>
                  </div>
                </div>
                <div className="flex flex-col flex-1 p-4 pt-3">
                  <div className="flex gap-1.5 flex-wrap mb-2">
                    {selectedCat && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#6C1D5F]/10 dark:bg-[#84117C]/20 text-[#6C1D5F] dark:text-[#84117C]">
                        {selectedCat.name}
                      </span>
                    )}
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400">
                      {form.level}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-[14px] line-clamp-2">{form.title || "Spring Boot Masterclass"}</h3>
                  <p className="text-[12px] text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2 leading-relaxed">{form.shortDescription || "Course description preview..."}</p>
                  <div className="flex items-center gap-3 text-[11px] text-gray-500 dark:text-gray-400 pt-3 border-t border-gray-100 dark:border-white/10 mt-3">
                    <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {form.language}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {form.durationHours || "0"} hrs</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.17 }} 
            whileHover={{ y: -6, x: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 bg-gradient-to-r from-[#01AC9F] to-[#4A90D9] z-50" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#01AC9F]40 to-transparent z-0" />
            <div className="p-5 pt-6 relative z-10">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-4">Field Summary</p>
              <div className="space-y-3">
                {[
                  { label: "Title", val: form.title, ok: !!form.title },
                  { label: "Level", val: form.level, ok: true },
                  { label: "Language", val: form.language, ok: true },
                  { label: "Duration", val: form.durationHours ? `${form.durationHours} hrs` : "—", ok: !!form.durationHours },
                  { label: "Description", val: form.description ? "Filled" : "Empty", ok: !!form.description },
                  { label: "Status", val: form.active ? "Active" : "Inactive", ok: true },
                ].map(({ label, val, ok }) => (
                  <div key={label} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 dark:text-gray-400 font-medium group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors">{label}</span>
                    <div className="flex items-center gap-1.5 text-xs text-right max-w-[120px] truncate"><span className={clsx("font-semibold truncate", ok ? "text-gray-900 dark:text-white" : "text-red-400")}>{val || "—"}</span>{ok ? <CheckCircle2 className="w-3.5 h-3.5 text-[#01AC9F] shrink-0" /> : <Circle className="w-3.5 h-3.5 text-gray-300 dark:text-gray-600 shrink-0" />}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.22 }} 
            whileHover={{ y: -6, x: -4, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.15)" }}
            className="glass-strong !border-0 rounded-2xl overflow-hidden relative group transition-all duration-500">
            <div className="absolute top-0 left-0 w-full h-[5px] group-hover:h-[8px] transition-all duration-500 bg-gradient-to-r from-amber-400 to-orange-400 z-50" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-amber-400/40 to-transparent z-0" />
            <div className="p-5 pt-6 bg-amber-50/50 dark:bg-amber-900/5 relative z-10">
              <p className="text-[10px] font-bold text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-3">Quick Tips</p>
              <ul className="space-y-2 text-xs text-amber-700 dark:text-amber-400/80">
                {["Titles should be clear and searchable","Use high quality thumbnails","Include specific learning outcomes","Set duration accurately"].map((tip) => (
                  <li key={tip} className="flex items-start gap-1.5 group-hover:translate-x-1 transition-transform duration-300">
                    <span className="w-1 h-1 rounded-full bg-amber-400 mt-1.5 shrink-0" />{tip}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {duplicateError && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-strong !border-0 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-red-500 z-50" />
              <div className="p-7 text-center">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <X className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-extrabold text-gray-900 dark:text-white mb-2">
                  Duplicate Found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-7 text-sm">
                  A course named <span className="font-semibold text-gray-800 dark:text-gray-200">"{duplicateError}"</span> with the same Category and Level already exists. Please make it unique.
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
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }} className="glass-strong !border-0 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-[6px] bg-red-500 z-50" />
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
