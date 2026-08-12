import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Plus,
  Settings,
  Video,
  FileText,
  Code,
  Link as LinkIcon,
  Trash2,
  Edit3,
  GripVertical,
  CheckCircle2,
  X,
  Layers,
  Image as ImageIcon,
  Globe,
  MoreVertical,
  BookOpen,
  BarChart2,
  PieChart as PieChartIcon,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Lock,
  Check,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useRouter } from "@tanstack/react-router";
import { useAppStore } from "../../store/useAppStore";
import { CourseService } from "@/services/api";
import { AIService } from "@/services/aiService";

const BRAND = "#6C1D5F";
const BRAND_LIGHT = "rgba(108,29,95,0.08)";

const CONTENT_COLORS = { VIDEO: "#ef4444", TEXT: "#3b82f6", PDF: "#f59e0b", CODE: "#8b5cf6" };

const ActionDropdown = ({ actions }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative" style={{ zIndex: 10 }}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground dark:text-gray-400 dark:hover:text-white transition-colors cursor-pointer"
        style={{ background: "transparent" }}
      >
        <MoreVertical className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 4 }}
            transition={{ duration: 0.12 }}
            className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#1a1a24] border border-border dark:border-[#2e2e3e] shadow-xl rounded-xl z-50 overflow-hidden flex flex-col py-1"
          >
            {actions.map((a, i) => (
              <button
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpen(false);
                  a.onClick();
                }}
                className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-semibold transition-colors w-full text-left dark:text-gray-200"
                style={{ color: a.danger ? "#ef4444" : undefined }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = a.danger
                    ? "rgba(239,68,68,0.06)"
                    : BRAND_LIGHT)
                }
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {a.icon} {a.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const getContentIcon = (type) => {
  switch (type) {
    case "VIDEO":
      return <Video className="w-4 h-4" style={{ color: CONTENT_COLORS.VIDEO }} />;
    case "TEXT":
      return <FileText className="w-4 h-4" style={{ color: CONTENT_COLORS.TEXT }} />;
    case "CODE":
      return <Code className="w-4 h-4" style={{ color: CONTENT_COLORS.CODE }} />;
    case "PDF":
      return <ImageIcon className="w-4 h-4" style={{ color: CONTENT_COLORS.PDF }} />;
    default:
      return <LinkIcon className="w-4 h-4 text-emerald-500" />;
  }
};


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

export default function HierarchyBuilder({ course }) {
  const router = useRouter();
  const { addToast } = useAppStore();
  const [modules, setModules] = useState(() => course?.modules || []);

  useEffect(() => {
    setModules(course?.modules || []);
  }, [course]);

  const [selectedModuleId, setSelectedModuleId] = useState(null);

  useEffect(() => {
    if (modules.length > 0 && !selectedModuleId) {
      setSelectedModuleId(modules[0].id);
    }
  }, [modules, selectedModuleId]);

  const [showModuleForm, setShowModuleForm] = useState(false);
  const [showSubmoduleForm, setShowSubmoduleForm] = useState(false);
  const [showContentForm, setShowContentForm] = useState(false);
  const [showSeoMetadata, setShowSeoMetadata] = useState(false);

  const [editModuleId, setEditModuleId] = useState(null);
  const [editSubmoduleId, setEditSubmoduleId] = useState(null);
  const [editContentId, setEditContentId] = useState(null);

  const [moduleForm, setModuleForm] = useState({
    title: "",
    description: "",
    orderIndex: 1,
    active: true,
    slug: "",
  });
  const [submoduleForm, setSubmoduleForm] = useState({
    title: "",
    description: "",
    slug: "",
    metaTitle: "",
    metaDescription: "",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    submoduleOrder: 1,
    active: true,
  });
  const [contentForm, setContentForm] = useState({
    type: "VIDEO",
    title: "",
    videoUrl: "",
    textContent: "",
    documentUrl: "",
  });

  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const handleGenerateAI = async (formType, title) => {
    if (!title) {
      addToast("Please enter a title first", "error");
      return;
    }
    if (!AIService.isConfigured()) {
      addToast("AI service is not configured", "error");
      return;
    }
    setIsGeneratingAI(true);
    try {
      const generatedText = await AIService.generateBriefDescription(
        title,
        "Course Modules",
        "Professional",
      );
      if (formType === "module") setModuleForm((prev) => ({ ...prev, description: generatedText }));
      else if (formType === "submodule")
        setSubmoduleForm((prev) => ({ ...prev, description: generatedText }));
      addToast("Description generated!", "success");
    } catch (err) {
      addToast(err.message || "Failed to generate description", "error");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleAddModule = async (e) => {
    e.preventDefault();
    if (editModuleId) {
      try {
        const payload = {
          title: moduleForm.title,
          description: moduleForm.description,
          position: moduleForm.orderIndex,
          isActive: moduleForm.active,
        };
        const updated = await CourseService.updateModule(editModuleId, payload);
        setModules(modules.map((mod) => (mod.id === editModuleId ? { ...mod, ...updated } : mod)));
        setEditModuleId(null);
        setShowModuleForm(false);
        addToast("Module Updated", "success");
      } catch (err) {
        addToast("Failed to update module", "error");
      }
      return;
    }
    try {
      const payload = {
        title: moduleForm.title,
        description: moduleForm.description,
        position: moduleForm.orderIndex,
        isActive: moduleForm.active,
      };
      const newModule = await CourseService.addModule(course.id, payload);
      setModules([...modules, { ...newModule, submodules: [] }]);
      setShowModuleForm(false);
      setSelectedModuleId(newModule.id);
      addToast("Module Created", "success");
    } catch (err) {
      addToast("Failed to create module", "error");
    }
  };

  const handleAddSubmodule = async (e) => {
    e.preventDefault();
    if (editSubmoduleId) {
      try {
        const payload = {
          title: submoduleForm.title,
          description: submoduleForm.description,
          position: submoduleForm.submoduleOrder,
          isActive: submoduleForm.active,
          slug: submoduleForm.slug,
          metaTitle: submoduleForm.metaTitle,
          canonicalUrl: submoduleForm.canonicalUrl,
          metaDescription: submoduleForm.metaDescription,
          ogTitle: submoduleForm.ogTitle,
          ogImageUrl: submoduleForm.ogImage,
          ogDescription: submoduleForm.ogDescription,
        };
        const updated = await CourseService.updateSubmodule(editSubmoduleId, payload);
        setModules(
          modules.map((m) =>
            m.id === selectedModuleId
              ? {
                  ...m,
                  submodules: m.submodules.map((sm) =>
                    sm.id === editSubmoduleId ? { ...sm, ...updated } : sm,
                  ),
                }
              : m,
          ),
        );
        setEditSubmoduleId(null);
        setShowSubmoduleForm(false);
        addToast("Submodule Updated", "success");
      } catch (err) {
        addToast("Failed to update submodule", "error");
      }
      return;
    }
    try {
      const payload = {
        title: submoduleForm.title,
        description: submoduleForm.description,
        position: submoduleForm.submoduleOrder,
        isActive: submoduleForm.active,
        slug: submoduleForm.slug,
        metaTitle: submoduleForm.metaTitle,
        canonicalUrl: submoduleForm.canonicalUrl,
        metaDescription: submoduleForm.metaDescription,
        ogTitle: submoduleForm.ogTitle,
        ogImageUrl: submoduleForm.ogImage,
        ogDescription: submoduleForm.ogDescription,
      };
      const newSubmodule = await CourseService.addSubmodule(course.id, selectedModuleId, payload);
      setModules(
        modules.map((m) =>
          m.id === selectedModuleId
            ? { ...m, submodules: [...(m.submodules || []), newSubmodule] }
            : m,
        ),
      );
      setShowSubmoduleForm(false);
      addToast("Submodule Created", "success");
    } catch (err) {
      addToast("Failed to create submodule", "error");
    }
  };

  const handleAddContent = async (e) => {
    e.preventDefault();
    if (!selectedModuleId || !editSubmoduleId) return;
    if (editContentId) {
      setModules(
        modules.map((mod) =>
          mod.id === selectedModuleId
            ? {
                ...mod,
                submodules: mod.submodules.map((sub) =>
                  sub.id === editSubmoduleId
                    ? {
                        ...sub,
                        contentBlocks: sub.contentBlocks.map((c) =>
                          c.id === editContentId ? { ...c, ...contentForm } : c,
                        ),
                      }
                    : sub,
                ),
              }
            : mod,
        ),
      );
      setEditContentId(null);
      setShowContentForm(false);
      addToast("Content Updated", "success");
      return;
    }
    try {
      const payload = {
        moduleId: selectedModuleId,
        subModuleId: editSubmoduleId,
        title: contentForm.title,
        type: contentForm.type,
        storageRef: contentForm.type === "VIDEO" ? contentForm.videoUrl : contentForm.documentUrl,
        position: 1,
      };
      const newContent = await CourseService.addContentItem(course.id, payload);
      setModules(
        modules.map((mod) =>
          mod.id === selectedModuleId
            ? {
                ...mod,
                submodules: mod.submodules.map((sub) =>
                  sub.id === editSubmoduleId
                    ? { ...sub, contentBlocks: [...(sub.contentBlocks || []), newContent] }
                    : sub,
                ),
              }
            : mod,
        ),
      );
      setShowContentForm(false);
      addToast("Content Added", "success");
    } catch (err) {
      addToast("Failed to create content", "error");
    }
  };

  const handleDeleteModule = async (id) => {
    if (window.confirm("Delete this module and all its content?")) {
      try {
        await CourseService.deleteModule(id);
        setModules(modules.filter((m) => m.id !== id));
        if (selectedModuleId === id) setSelectedModuleId(null);
        addToast("Module deleted", "success");
      } catch (err) {
        addToast("Failed to delete module", "error");
      }
    }
  };
  const handleDeleteSubmodule = async (sid) => {
    if (window.confirm("Delete this submodule and all its content?")) {
      try {
        await CourseService.deleteSubmodule(sid);
        setModules(
          modules.map((m) =>
            m.id === selectedModuleId
              ? { ...m, submodules: m.submodules.filter((s) => s.id !== sid) }
              : m,
          ),
        );
        addToast("Submodule deleted", "success");
      } catch (err) {
        addToast("Failed to delete submodule", "error");
      }
    }
  };
  const handleDeleteContent = async (sid, cid) => {
    if (window.confirm("Delete this content?")) {
      try {
        await CourseService.deleteContentItem(cid);
        setModules(
          modules.map((m) =>
            m.id === selectedModuleId
              ? {
                  ...m,
                  submodules: m.submodules.map((s) =>
                    s.id === sid
                      ? { ...s, contentBlocks: s.contentBlocks.filter((c) => c.id !== cid) }
                      : s,
                  ),
                }
              : m,
          ),
        );
        addToast("Content deleted", "success");
      } catch (err) {
        addToast("Failed to delete content", "error");
      }
    }
  };

  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const inputCls =
    "w-full px-3.5 py-2.5 bg-background dark:bg-[#1a1a24] border border-border dark:border-[#3a3a4a] rounded-xl text-sm text-foreground dark:text-white focus:outline-none transition-colors";

  const renderToggle = (active, onChange) => (
    <label
      className="relative inline-flex items-center cursor-pointer"
      onClick={(e) => e.stopPropagation()}
    >
      <input type="checkbox" className="sr-only peer" checked={active} onChange={onChange} />
      <div
        className="w-10 h-5 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
        style={{ background: active ? BRAND : "#d1d5db" }}
      ></div>
    </label>
  );

  const mediaCounts = { VIDEO: 0, TEXT: 0, PDF: 0, CODE: 0 };
  modules.forEach((m) => {
    m.submodules?.forEach((sm) => {
      sm.contentBlocks?.forEach((cb) => {
        if (mediaCounts[cb.type] !== undefined) mediaCounts[cb.type]++;
      });
    });
  });
  const mediaData = [
    { name: "Video", value: mediaCounts.VIDEO, color: CONTENT_COLORS.VIDEO },
    { name: "Text", value: mediaCounts.TEXT, color: CONTENT_COLORS.TEXT },
    { name: "PDF", value: mediaCounts.PDF, color: CONTENT_COLORS.PDF },
    { name: "Code", value: mediaCounts.CODE, color: CONTENT_COLORS.CODE },
  ].filter((d) => d.value > 0);
  if (mediaData.length === 0) mediaData.push({ name: "Empty", value: 1, color: "#e5e7eb" });

  return (
    <div
      className="flex flex-col bg-[#F7F8FC] dark:bg-[#0a0a0f] transition-colors rounded-2xl border border-gray-200 dark:border-[#2e2e3e] overflow-hidden"
      style={{ height: "calc(100vh - 40px)" }}
    >
      <div className="h-14 border-b border-border dark:border-[#2e2e3e] bg-white dark:bg-[#15151f] flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.history.back()}
            className="h-8 w-8 rounded-lg border border-border dark:border-[#2e2e3e] flex items-center justify-center hover:bg-gray-50 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-border" />
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: BRAND }}
            >
              Course Curriculum
            </span>
            <h1 className="text-sm font-bold text-foreground dark:text-white">
              {course?.title || "Unknown Course"}
            </h1>
          </div>
        </div>
        <button
          className="px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-sm flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          style={{ background: BRAND }}
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> All changes saved
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Analytics Header (Visual Representation) */}
        {modules.length > 0 && (
          <div className="h-40 border-b border-border dark:border-[#2e2e3e] bg-[#fafafa] dark:bg-[#0d0d14] shrink-0 p-4 flex gap-4 overflow-hidden">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-1 bg-white dark:bg-[#15151f] rounded-xl border border-gray-100 dark:border-[#2e2e3e] p-4 flex items-center justify-between shadow-sm perspective-1000"
              whileHover={{ rotateX: 2, rotateY: 2, scale: 1.01 }}
            >
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Modules
                </h3>
                <div className="text-3xl font-black text-foreground dark:text-white">
                  {modules.length}
                </div>
              </div>
              <Layers className="w-10 h-10 text-[#6C1D5F] opacity-20" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1 bg-white dark:bg-[#15151f] rounded-xl border border-gray-100 dark:border-[#2e2e3e] p-4 flex items-center justify-between shadow-sm perspective-1000"
              whileHover={{ rotateX: 2, rotateY: 2, scale: 1.01 }}
            >
              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Submodules
                </h3>
                <div className="text-3xl font-black text-foreground dark:text-white">
                  {modules.reduce((acc, m) => acc + (m.submodules?.length || 0), 0)}
                </div>
              </div>
              <BookOpen className="w-10 h-10 text-[#01AC9F] opacity-20" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-[1.2] bg-white dark:bg-[#15151f] rounded-xl border border-gray-100 dark:border-[#2e2e3e] p-2 shadow-sm flex flex-col justify-center perspective-1000"
              whileHover={{ rotateX: 2, rotateY: -2, scale: 1.01 }}
            >
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-1">
                Hierarchy
              </h3>
              <div className="h-[90px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Modules", count: modules.length },
                      {
                        name: "Submodules",
                        count: modules.reduce((acc, m) => acc + (m.submodules?.length || 0), 0),
                      },
                    ]}
                    layout="vertical"
                    margin={{ top: 0, right: 10, left: 65, bottom: 0 }}
                  >
                    <XAxis type="number" hide />
                    <YAxis
                      dataKey="name"
                      type="category"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "#888" }}
                    />
                    <RechartsTooltip
                      cursor={{ fill: "#f3f4f6" }}
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        padding: "4px 8px",
                        fontSize: "11px",
                      }}
                    />
                    <Bar dataKey="count" fill="#01AC9F" radius={[0, 4, 4, 0]} barSize={12} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex-1 bg-white dark:bg-[#15151f] rounded-xl border border-gray-100 dark:border-[#2e2e3e] p-2 shadow-sm flex flex-col justify-center perspective-1000"
              whileHover={{ rotateX: 2, rotateY: 2, scale: 1.01 }}
            >
              <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest text-center mb-1">
                Media Types
              </h3>
              <div className="h-[90px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={mediaData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={25}
                      outerRadius={38}
                      paddingAngle={2}
                    >
                      {mediaData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        padding: "4px 8px",
                        fontSize: "11px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden">
          {/* LEFT COLUMN: MODULES */}
          <div className="w-1/2 flex flex-col border-r border-border dark:border-[#2e2e3e] bg-[#fafafa] dark:bg-[#0d0d14]">
            <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-[#15151f] border-b border-border dark:border-[#2e2e3e] shrink-0">
              <div>
                <h2 className="text-lg font-bold text-foreground dark:text-white">Modules</h2>
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  Course:{" "}
                  <span className="bg-gray-100 dark:bg-[#252535] px-2 py-0.5 rounded-md flex items-center gap-1">
                    {course?.title} <Lock className="w-3 h-3" />
                  </span>
                </p>
              </div>
              <button
                onClick={() => {
                  setEditModuleId(null);
                  setModuleForm({
                    title: "",
                    description: "",
                    orderIndex: modules.length + 1,
                    active: true,
                    slug: "",
                  });
                  setShowModuleForm(true);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90"
                style={{ background: BRAND }}
              >
                <Plus className="w-4 h-4" /> Add Module
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative">
              {modules.map((module, mIdx) => {
                const isSelected = module.id === selectedModuleId;
                return (
                  <div
                    key={module.id}
                    onClick={() => {
                      setSelectedModuleId(module.id);
                      setShowSubmoduleForm(false);
                    }}
                    className={`bg-white dark:bg-[#15151f] rounded-2xl border transition-all cursor-pointer shadow-sm ${isSelected ? "ring-1" : "hover:border-gray-300"}`}
                    style={{
                      borderColor: isSelected ? BRAND : "#e5e7eb",
                      "--tw-ring-color": BRAND,
                    }}
                  >
                    <div className="p-4 flex gap-4">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold shrink-0"
                        style={{ background: BRAND_LIGHT, color: BRAND }}
                      >
                        {String(mIdx + 1).padStart(2, "0")}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-foreground dark:text-white truncate">
                          {module.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 truncate">
                          {module.description || "No description provided."}
                        </p>
                        <div className="flex items-center gap-4 mt-3">
                          <div className="flex items-center gap-2">
                            {renderToggle(module.active, () => {
                              const newMods = modules.map((m) =>
                                m.id === module.id ? { ...m, active: !m.active } : m,
                              );
                              setModules(newMods);
                            })}
                            <span
                              className="text-xs font-bold"
                              style={{ color: module.active ? BRAND : "#9ca3af" }}
                            >
                              {module.active ? "Active" : "Inactive"}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteModule(module.id);
                            }}
                            className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-between shrink-0 ml-2">
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditModuleId(module.id);
                            setModuleForm({
                              title: module.title,
                              description: module.description,
                              active: module.active,
                              orderIndex: module.orderIndex || mIdx + 1,
                              slug: module.slug || "",
                            });
                            setShowModuleForm(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-gray-50"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {showModuleForm && (
                <div
                  className="bg-white dark:bg-[#15151f] rounded-2xl shadow-lg overflow-hidden mt-6"
                  style={{ border: `2px solid ${BRAND}` }}
                >
                  <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-gray-50 dark:bg-[#1a1a24]">
                    <div
                      className="flex items-center gap-2 font-bold text-sm"
                      style={{ color: BRAND }}
                    >
                      <Edit3 className="w-4 h-4" /> {editModuleId ? "Edit Module" : "Add Module"}
                    </div>
                    <button
                      onClick={() => setShowModuleForm(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <form onSubmit={handleAddModule} className="p-5 space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-muted-foreground">Course:</span>
                      <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                        {course?.title} <Lock className="w-3 h-3" />
                      </span>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Title *
                      </label>
                      <div className="relative">
                        <input
                          required
                          type="text"
                          className={inputCls}
                          value={moduleForm.title}
                          onChange={(e) => {
                            const t = e.target.value;
                            setModuleForm({
                              ...moduleForm,
                              title: t,
                              slug: t
                                .toLowerCase()
                                .replace(/[^a-z0-9]+/g, "-")
                                .replace(/(^-|-$)/g, ""),
                            });
                          }}
                        />
                        <span className="absolute right-3 top-3 text-xs text-gray-400">
                          {moduleForm.title.length}/200
                        </span>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-muted-foreground uppercase block">
                          Description
                        </label>
                        <button
                          type="button"
                          onClick={() => handleGenerateAI("module", moduleForm.title)}
                          disabled={isGeneratingAI || !moduleForm.title}
                          className="text-[10px] font-bold text-white px-2 py-1 rounded-md flex items-center gap-1.5 disabled:opacity-50"
                          style={{ background: BRAND }}
                        >
                          <Sparkles className="w-3 h-3" /> Generate with AI
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        className={inputCls + " resize-none"}
                        value={moduleForm.description}
                        onChange={(e) =>
                          setModuleForm({ ...moduleForm, description: e.target.value })
                        }
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                          Module Order
                        </label>
                        <input
                          type="number"
                          min={1}
                          className={inputCls}
                          value={moduleForm.orderIndex}
                          onChange={(e) =>
                            setModuleForm({
                              ...moduleForm,
                              orderIndex: parseInt(e.target.value) || 1,
                            })
                          }
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                          Active
                        </label>
                        <div className="flex items-center gap-2 mt-2">
                          {renderToggle(moduleForm.active, (e) =>
                            setModuleForm({ ...moduleForm, active: e.target.checked }),
                          )}
                          <span
                            className="text-sm font-bold"
                            style={{ color: moduleForm.active ? BRAND : "#9ca3af" }}
                          >
                            Active
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-border mt-4">
                      <div className="text-[10px] text-gray-400">Created: Just now</div>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setShowModuleForm(false)}
                          className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                          style={{ background: BRAND }}
                        >
                          Save Module
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: SUBMODULES */}
          <div className="w-1/2 flex flex-col bg-white dark:bg-[#1a1a24]">
            {selectedModule ? (
              <>
                <div className="px-6 py-4 flex items-center justify-between border-b border-border dark:border-[#2e2e3e] shrink-0 bg-white dark:bg-[#15151f]">
                  <div>
                    <h2 className="text-lg font-bold text-foreground dark:text-white">
                      Submodules
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      Module:{" "}
                      <span className="bg-gray-100 dark:bg-[#252535] px-2 py-0.5 rounded-md flex items-center gap-1">
                        {selectedModule.title} <Lock className="w-3 h-3" />
                      </span>
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditSubmoduleId(null);
                      setSubmoduleForm({
                        title: "",
                        description: "",
                        slug: "",
                        metaTitle: "",
                        metaDescription: "",
                        canonicalUrl: "",
                        ogTitle: "",
                        ogDescription: "",
                        ogImage: "",
                        submoduleOrder: (selectedModule.submodules?.length || 0) + 1,
                        active: true,
                      });
                      setShowSubmoduleForm(true);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-sm hover:opacity-90"
                    style={{ background: BRAND }}
                  >
                    <Plus className="w-4 h-4" /> Add Submodule
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {(selectedModule.submodules || []).map((sm, smIdx) => (
                    <div
                      key={sm.id}
                      className="bg-white dark:bg-[#15151f] rounded-2xl border border-border shadow-sm hover:border-gray-300 transition-colors"
                    >
                      <div className="p-4 flex gap-4">
                        <div className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                          {String(smIdx + 1).padStart(2, "0")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-foreground dark:text-white truncate">
                            {sm.title}
                          </h3>
                          <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                            /{sm.slug || sm.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1 truncate">
                            {sm.description || "No description."}
                          </p>
                          <div className="flex items-center gap-4 mt-3">
                            <div className="flex items-center gap-2">
                              {renderToggle(sm.active, () => {
                                const newMods = modules.map((m) =>
                                  m.id === selectedModuleId
                                    ? {
                                        ...m,
                                        submodules: m.submodules.map((sub) =>
                                          sub.id === sm.id ? { ...sub, active: !sub.active } : sub,
                                        ),
                                      }
                                    : m,
                                );
                                setModules(newMods);
                              })}
                              <span
                                className="text-xs font-bold"
                                style={{ color: sm.active ? BRAND : "#9ca3af" }}
                              >
                                {sm.active ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubmodule(sm.id);
                              }}
                              className="text-xs font-bold text-orange-500 hover:text-orange-600 flex items-center gap-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        </div>
                        <div className="flex flex-col items-center justify-between shrink-0 ml-2 gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              router.navigate({
                                to: `/admin/submodules/${sm.id}/content`,
                                search: { courseId: course.id, moduleId: selectedModuleId },
                              });
                            }}
                            className="text-[10px] font-bold px-2 py-1 rounded-md text-white shadow-sm flex items-center gap-1 hover:opacity-90 transition-opacity"
                            style={{ background: BRAND }}
                          >
                            <Layers className="w-3 h-3" /> Content
                          </button>
                          <div className="flex gap-1 mt-auto">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditSubmoduleId(sm.id);
                                setSubmoduleForm({
                                  ...sm,
                                  submoduleOrder: sm.position || smIdx + 1,
                                });
                                setShowSubmoduleForm(true);
                              }}
                              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-gray-50"
                            >
                              <Edit3 className="w-4 h-4 text-gray-500" />
                            </button>
                            <ChevronRight className="w-5 h-5 text-gray-400 self-center" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {showSubmoduleForm && (
                    <div
                      className="bg-white dark:bg-[#15151f] rounded-2xl shadow-lg overflow-hidden mt-6"
                      style={{ border: `2px solid ${BRAND}` }}
                    >
                      <div className="px-5 py-4 border-b border-border flex justify-between items-center bg-gray-50 dark:bg-[#1a1a24]">
                        <div
                          className="flex items-center gap-2 font-bold text-sm"
                          style={{ color: BRAND }}
                        >
                          <Plus className="w-4 h-4" />{" "}
                          {editSubmoduleId ? "Edit Submodule" : "Add Submodule"}
                        </div>
                        <button
                          onClick={() => setShowSubmoduleForm(false)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <form onSubmit={handleAddSubmodule} className="p-5 space-y-4">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground">Module:</span>
                          <span className="bg-gray-100 text-xs px-2 py-0.5 rounded-md flex items-center gap-1">
                            {selectedModule.title} <Lock className="w-3 h-3" />
                          </span>
                        </div>
                        <div className="mb-4">
                          <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                            Title *
                          </label>
                          <input
                            required
                            type="text"
                            className={inputCls}
                            placeholder="e.g. Variables and Types"
                            value={submoduleForm.title}
                            onChange={(e) => {
                              const t = e.target.value;
                              setSubmoduleForm({
                                ...submoduleForm,
                                title: t,
                                slug: t
                                  .toLowerCase()
                                  .replace(/[^a-z0-9]+/g, "-")
                                  .replace(/(^-|-$)/g, ""),
                              });
                            }}
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-xs font-bold text-muted-foreground uppercase block">
                              Description
                            </label>
                            <button
                              type="button"
                              onClick={() => handleGenerateAI("submodule", submoduleForm.title)}
                              disabled={isGeneratingAI || !submoduleForm.title}
                              className="text-[10px] font-bold text-white px-2 py-1 rounded-md flex items-center gap-1.5 disabled:opacity-50"
                              style={{ background: BRAND }}
                            >
                              <Sparkles className="w-3 h-3" /> Generate with AI
                            </button>
                          </div>
                          <textarea
                            rows={2}
                            className={inputCls + " resize-none"}
                            placeholder="Describe this submodule..."
                            value={submoduleForm.description}
                            onChange={(e) =>
                              setSubmoduleForm({ ...submoduleForm, description: e.target.value })
                            }
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                              Submodule Order
                            </label>
                            <input
                              type="number"
                              min={1}
                              className={inputCls}
                              value={submoduleForm.submoduleOrder}
                              onChange={(e) =>
                                setSubmoduleForm({
                                  ...submoduleForm,
                                  submoduleOrder: parseInt(e.target.value) || 1,
                                })
                              }
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                              Active
                            </label>
                            <div className="flex items-center gap-2 mt-2">
                              {renderToggle(submoduleForm.active, (e) =>
                                setSubmoduleForm({ ...submoduleForm, active: e.target.checked }),
                              )}
                              <span
                                className="text-sm font-bold"
                                style={{ color: submoduleForm.active ? BRAND : "#9ca3af" }}
                              >
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4 flex justify-end gap-2 border-t border-border mt-4">
                          <button
                            type="button"
                            onClick={() => setShowSubmoduleForm(false)}
                            className="px-4 py-2 rounded-xl text-xs font-bold border border-gray-300 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white shadow-sm"
                            style={{ background: BRAND }}
                          >
                            Save Submodule
                          </button>
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
                <Layers className="w-12 h-12 mb-4 opacity-20" style={{ color: BRAND }} />
                <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300">
                  Select a Module
                </h3>
                <p className="text-sm text-gray-400 mt-2">
                  Choose a module from the left panel to manage its submodules.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
