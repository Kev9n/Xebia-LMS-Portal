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
  Image as ImageIcon,
  LayoutTemplate,
  Table,
} from "lucide-react";
import { useRouter } from "@tanstack/react-router";
import { useAppStore } from "../../store/useAppStore";
import { CourseService } from "@/services/api";
import {
  getCloudinaryAssetUrl,
  getCloudinaryDocumentPreviewUrl,
  normalizeCloudinaryDocumentUrl,
} from "../../../lib/cloudinary";

const BRAND = "#6C1D5F";
const BRAND_LIGHT = "rgba(108,29,95,0.08)";

const uploadToCloudinary = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error(
      "Cloudinary is not configured. Please use the URL field directly instead, or add VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET to your .env file.",
    );
  }

  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", uploadPreset);

  const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`, {
    method: "POST",
    body: fd,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || "Failed to upload file");
  }

  const data = await response.json();
  return getCloudinaryAssetUrl(data);
};

const BLOCK_TYPES = [
  { id: "Text", label: "Text", icon: FileText, backendType: "NOTE" },
  { id: "Heading", label: "Heading", icon: FileText, backendType: "NOTE" },
  { id: "Code", label: "Code", icon: Code, backendType: "NOTE" },
  { id: "Video", label: "Video", icon: Video, backendType: "VIDEO_REFERENCE" },
  { id: "Image", label: "Image", icon: ImageIcon, backendType: "NOTE" },
  { id: "PDF", label: "PDF", icon: FileText, backendType: "PDF" },
  { id: "Callout", label: "Callout", icon: LayoutTemplate, backendType: "NOTE" },
  { id: "Table", label: "Table", icon: Table, backendType: "COMPARISON_TABLE" },
];

const FileUpload = ({ accept, onUpload, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = React.useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onUpload(files[0]);
    }
    // Reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
        isDragging
          ? "border-[#6C1D5F] bg-[#6C1D5F]/5 scale-[1.01]"
          : "border-gray-300 hover:border-[#6C1D5F]/50 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-[#1a1a24]"
      }`}
    >
      <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${isDragging ? "bg-[#6C1D5F]/10" : "bg-gray-100 dark:bg-gray-800"}`}
        >
          <Plus className={`w-6 h-6 ${isDragging ? "text-[#6C1D5F]" : "text-gray-400"}`} />
        </div>
        <p className="text-sm font-bold text-gray-600 dark:text-gray-300">
          {label || "Drag & drop a file here"}
        </p>
        <p className="text-xs text-gray-400">or click to browse &bull; {accept}</p>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
};

export default function ContentManager({ submoduleId, courseId, moduleId }) {
  const router = useRouter();
  const { addToast } = useAppStore();
  const [blocks, setBlocks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const [showEditor, setShowEditor] = useState(false);
  const [editId, setEditId] = useState(null);

  const [activeType, setActiveType] = useState("Text");
  const [formData, setFormData] = useState({
    title: "",
    text: "",
    code: "",
    language: "javascript",
    videoUrl: "",
    imageUrl: "",
    pdfUrl: "",
    alt: "",
    caption: "",
    headingLevel: 1,
    contentOrder: 1,
    isActive: true,
  });

  const patchFormData = (updates) => {
    setFormData((current) => {
      const next = { ...current, ...updates };
      if (next.pdfUrl) {
        next.pdfUrl = normalizeCloudinaryDocumentUrl(next.pdfUrl);
      }
      return next;
    });
  };

  useEffect(() => {
    if (!courseId) return;
    CourseService.getCourseHierarchy(courseId)
      .then((data) => {
        const module = data.modules.find((m) => String(m.id) === String(moduleId));
        if (module) {
          const sub = module.submodules.find((s) => String(s.id) === String(submoduleId));
          if (sub && sub.contentBlocks) {
            setBlocks(sub.contentBlocks);
          }
        }
        setIsLoading(false);
      })
      .catch((err) => {
        addToast("Failed to load content", "error");
        setIsLoading(false);
      });
  }, [courseId, moduleId, submoduleId, addToast]);

  const handleSave = async (e) => {
    e.preventDefault();
    const typeDef = BLOCK_TYPES.find((b) => b.id === activeType);
    const normalizedFormData = {
      ...formData,
      pdfUrl: normalizeCloudinaryDocumentUrl(formData.pdfUrl),
    };
    const storageRef = JSON.stringify({ uiType: activeType, ...normalizedFormData });

    try {
      if (editId) {
        const payload = {
          moduleId,
          subModuleId: submoduleId,
          title: formData.title || `${activeType} Block`,
          type: typeDef.backendType,
          storageRef,
          position: formData.contentOrder,
        };
        const updatedBlock = await CourseService.updateContentItem(editId, payload);
        setBlocks(blocks.map((b) => (b.id === editId ? updatedBlock : b)));
        addToast("Content updated", "success");
      } else {
        const payload = {
          moduleId,
          subModuleId: submoduleId,
          title: formData.title || `${activeType} Block`,
          type: typeDef.backendType,
          storageRef,
          position: formData.contentOrder,
        };
        const newBlock = await CourseService.addContentItem(courseId, payload);
        setBlocks([...blocks, newBlock]);
        addToast("Content created", "success");
      }
      setShowEditor(false);
    } catch (err) {
      addToast("Error saving content", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this content block?")) {
      try {
        await CourseService.deleteContentItem(id);
        setBlocks(blocks.filter((b) => b.id !== id));
        addToast("Content deleted", "success");
      } catch (err) {
        addToast("Error deleting content", "error");
      }
    }
  };

  const handleEdit = (block) => {
    let data = {};
    try {
      let parsed = JSON.parse(block.storageRef);
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      data = parsed || {};
    } catch (e) {}

    // Find the correct activeType from the saved data
    const uiType =
      data.uiType || BLOCK_TYPES.find((b) => b.backendType === block.type)?.id || "Text";

    setEditId(block.id);
    setActiveType(uiType);
    setFormData({
      title: block.title,
      text: data.text || "",
      headingText: data.headingText || "",
      code: data.code || "",
      language: data.language || "javascript",
      videoUrl: data.videoUrl || "",
      imageUrl: data.imageUrl || "",
      pdfUrl: data.pdfUrl || "",
      tableData: data.tableData || "",
      alt: data.alt || "",
      caption: data.caption || "",
      headingLevel: data.headingLevel || 1,
      contentOrder: block.position,
      isActive: data.isActive !== false,
    });
    setShowEditor(true);
  };

  const handleAddNew = () => {
    setEditId(null);
    setActiveType("Text");
    setFormData({
      title: "",
      text: "",
      headingText: "",
      code: "",
      language: "javascript",
      videoUrl: "",
      imageUrl: "",
      pdfUrl: "",
      tableData: "",
      alt: "",
      caption: "",
      headingLevel: 1,
      contentOrder: blocks.length + 1,
      isActive: true,
    });
    setShowEditor(true);
  };

  const renderToggle = (active, onChange) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" className="sr-only peer" checked={active} onChange={onChange} />
      <div
        className="w-10 h-5 rounded-full peer-checked:after:translate-x-5 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"
        style={{ background: active ? BRAND : "#d1d5db" }}
      ></div>
    </label>
  );

  const inputCls =
    "w-full px-3.5 py-2.5 bg-background dark:bg-[#1a1a24] border border-border dark:border-[#3a3a4a] rounded-xl text-sm focus:outline-none transition-colors text-foreground dark:text-white";

  return (
    <div
      className="flex flex-col bg-[#F7F8FC] dark:bg-[#0a0a0f] transition-colors rounded-2xl border border-gray-200 dark:border-[#2e2e3e] overflow-hidden"
      style={{ height: "calc(100vh - 40px)" }}
    >
      <div className="h-14 border-b border-border dark:border-[#2e2e3e] bg-white dark:bg-[#15151f] flex items-center justify-between px-6 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.history.back()}
            className="h-8 w-8 rounded-lg border border-border dark:border-[#2e2e3e] flex items-center justify-center hover:bg-gray-50 dark:hover:bg-[#1a1a24] cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="h-5 w-px bg-border" />
          <div>
            <span
              className="text-[10px] font-bold uppercase tracking-widest"
              style={{ color: BRAND }}
            >
              Content Management
            </span>
            <h1 className="text-sm font-bold text-foreground dark:text-white">Submodule Blocks</h1>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* LEFT COLUMN: BLOCKS */}
        <div className="w-1/2 flex flex-col border-r border-border dark:border-[#2e2e3e] bg-[#fafafa] dark:bg-[#0d0d14]">
          <div className="px-6 py-4 flex items-center justify-between bg-white dark:bg-[#15151f] border-b border-border dark:border-[#2e2e3e] shrink-0">
            <h2 className="text-lg font-bold text-foreground dark:text-white">
              Existing Content Blocks
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {isLoading ? (
              <div className="text-center text-gray-500 py-10">Loading content...</div>
            ) : blocks.length === 0 ? (
              <div className="text-center text-gray-500 py-10">No content blocks found.</div>
            ) : (
              blocks.map((block) => {
                let data = {};
                try {
                  let parsed = JSON.parse(block.storageRef);
                  if (typeof parsed === "string") {
                    parsed = JSON.parse(parsed);
                  }
                  data = parsed;
                } catch (e) {}
                const typeDef = BLOCK_TYPES.find((b) => b.id === data.uiType) || BLOCK_TYPES[0];
                const Icon = typeDef.icon;
                return (
                  <div
                    key={block.id}
                    className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm flex items-center p-4 gap-4"
                  >
                    <div className="cursor-grab text-gray-400 hover:text-gray-600">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                      style={{ background: BRAND_LIGHT, color: BRAND }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full"
                          style={{ background: BRAND_LIGHT, color: BRAND }}
                        >
                          {typeDef.label}
                        </span>
                        <span className="text-xs text-gray-400">Order: {block.position}</span>
                      </div>
                      <h3 className="text-sm font-bold text-foreground dark:text-white truncate">
                        {block.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-3">
                      {renderToggle(data.isActive !== false, () => {})}
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => handleEdit(block)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border hover:bg-gray-50"
                        >
                          <Edit3 className="w-4 h-4 text-gray-500" />
                        </button>
                        <button
                          onClick={() => handleDelete(block.id)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-100 bg-red-50 hover:bg-red-100"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            <button
              onClick={() => handleAddNew()}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#3a3a4a] text-gray-500 hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300 flex items-center justify-center gap-2 font-bold transition-colors"
            >
              <Plus className="w-5 h-5" /> Add Content Block
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: EDITOR */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-[#1a1a24]">
          {showEditor ? (
            <form onSubmit={handleSave} className="flex-1 flex flex-col h-full overflow-hidden">
              <div className="px-6 py-4 flex items-center justify-between border-b border-border dark:border-[#2e2e3e] shrink-0 bg-white dark:bg-[#15151f]">
                <h2 className="text-lg font-bold text-foreground dark:text-white">
                  {editId ? "Edit Block" : "New Block"}
                </h2>
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-2">
                    Content Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {BLOCK_TYPES.map((type) => {
                      const isSelected = activeType === type.id;
                      const Icon = type.icon;
                      return (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setActiveType(type.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${isSelected ? "text-white" : "text-gray-600 bg-white border-gray-200 hover:bg-gray-50"}`}
                          style={{
                            background: isSelected ? BRAND : undefined,
                            borderColor: isSelected ? BRAND : undefined,
                          }}
                        >
                          <Icon className="w-3.5 h-3.5" /> {type.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {isUploadingFile && (
                  <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-bold flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                    Uploading file to Cloudinary, please wait...
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                      Title
                    </label>
                    <input
                      required
                      type="text"
                      className={inputCls}
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Block title"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                      Content Order
                    </label>
                    <input
                      type="number"
                      min="1"
                      className={inputCls}
                      value={formData.contentOrder}
                      onChange={(e) =>
                        setFormData({ ...formData, contentOrder: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>

                {activeType === "Heading" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Heading Level
                      </label>
                      <select
                        className={inputCls}
                        value={formData.headingLevel}
                        onChange={(e) =>
                          setFormData({ ...formData, headingLevel: parseInt(e.target.value) })
                        }
                      >
                        <option value={1}>H1</option>
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                        <option value={5}>H5</option>
                        <option value={6}>H6</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Heading Text
                      </label>
                      <input
                        type="text"
                        className={inputCls}
                        value={formData.headingText}
                        onChange={(e) => setFormData({ ...formData, headingText: e.target.value })}
                        placeholder="Enter heading text..."
                      />
                    </div>
                  </div>
                )}

                {(activeType === "Text" || activeType === "Callout") && (
                  <div className="space-y-4">
                    {activeType === "Text" && (
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                          Import from .TXT (Optional)
                        </label>
                        <FileUpload
                          accept=".txt"
                          onUpload={(file) => {
                            const reader = new FileReader();
                            reader.onload = (e) =>
                              setFormData({ ...formData, text: e.target.result });
                            reader.readAsText(file);
                          }}
                          label="Drag & drop a .txt file to import text"
                        />
                      </div>
                    )}
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        {activeType === "Callout" ? "Body" : "Text"}
                      </label>
                      <textarea
                        rows={6}
                        className={inputCls}
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder="Enter text content..."
                      />
                    </div>
                  </div>
                )}

                {activeType === "Code" && (
                  <>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Language
                      </label>
                      <select
                        className={inputCls}
                        value={formData.language}
                        onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                      >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="html">HTML</option>
                        <option value="css">CSS</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Code
                      </label>
                      <textarea
                        rows={8}
                        className={`${inputCls} font-mono`}
                        value={formData.code}
                        onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                        placeholder="// Write code here"
                      />
                    </div>
                  </>
                )}

                {activeType === "Video" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Upload Video
                      </label>
                      <FileUpload
                        accept="video/*"
                        onUpload={async (file) => {
                          try {
                            setIsUploadingFile(true);
                            const url = await uploadToCloudinary(file);
                            patchFormData({ videoUrl: url });
                            addToast("Video uploaded successfully!", "success");
                          } catch (err) {
                            addToast(err.message, "error");
                          } finally {
                            setIsUploadingFile(false);
                          }
                        }}
                        label="Drag & drop a video file"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Or Video URL
                      </label>
                      <input
                        type="url"
                        className={inputCls}
                        value={formData.videoUrl}
                        onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    {formData.videoUrl && (
                      <div className="mt-4 aspect-video rounded-xl overflow-hidden border border-border shadow-sm">
                        <iframe
                          src={formData.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                          title="Video Preview"
                        />
                      </div>
                    )}
                  </div>
                )}

                {activeType === "Image" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Upload Image
                      </label>
                      <FileUpload
                        accept="image/*"
                        onUpload={async (file) => {
                          try {
                            setIsUploadingFile(true);
                            const url = await uploadToCloudinary(file);
                            patchFormData({ imageUrl: url });
                            addToast("Image uploaded successfully!", "success");
                          } catch (err) {
                            addToast(err.message, "error");
                          } finally {
                            setIsUploadingFile(false);
                          }
                        }}
                        label="Drag & drop an image"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Or Image URL
                      </label>
                      <input
                        type="url"
                        className={inputCls}
                        value={formData.imageUrl}
                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    {formData.imageUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm flex justify-center bg-gray-50 dark:bg-card p-2">
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          className="max-w-full h-auto rounded-lg max-h-64 object-contain"
                        />
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                          Alt Text
                        </label>
                        <input
                          type="text"
                          className={inputCls}
                          value={formData.alt}
                          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                          Caption
                        </label>
                        <input
                          type="text"
                          className={inputCls}
                          value={formData.caption}
                          onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {activeType === "PDF" && (
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Upload PDF
                      </label>
                      <FileUpload
                        accept=".pdf"
                        onUpload={async (file) => {
                          try {
                            setIsUploadingFile(true);
                            const url = await uploadToCloudinary(file);
                            patchFormData({ pdfUrl: url });
                            addToast("PDF uploaded successfully!", "success");
                          } catch (err) {
                            addToast(err.message, "error");
                          } finally {
                            setIsUploadingFile(false);
                          }
                        }}
                        label="Drag & drop a PDF file"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                        Or PDF URL
                      </label>
                      <input
                        type="url"
                        className={inputCls}
                        value={formData.pdfUrl}
                        onChange={(e) => patchFormData({ pdfUrl: e.target.value })}
                        placeholder="https://..."
                      />
                    </div>
                    {formData.pdfUrl && (
                      <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-sm bg-gray-50 dark:bg-card">
                        <img
                          src={getCloudinaryDocumentPreviewUrl(formData.pdfUrl)}
                          alt="PDF preview"
                          className="w-full h-auto object-contain"
                        />
                        <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
                          PDF preview uses the first page image generated by Cloudinary.
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeType === "Table" && (
                  <div>
                    <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                      JSON Table Data
                    </label>
                    <p className="text-xs text-gray-400 mb-2">
                      Format:{" "}
                      <code className="bg-gray-100 dark:bg-gray-800 px-1 rounded">{`[{"Col1":"Val1","Col2":"Val2"}]`}</code>
                    </p>
                    <textarea
                      rows={6}
                      className={`${inputCls} font-mono`}
                      value={formData.tableData}
                      onChange={(e) => setFormData({ ...formData, tableData: e.target.value })}
                      placeholder={`[{"Feature":"Compiler","Description":"Translates entire source code at once"},{"Feature":"Interpreter","Description":"Translates source code line by line"}]`}
                    />
                  </div>
                )}

                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase block mb-1.5">
                    Active
                  </label>
                  <div className="flex items-center gap-2 mt-2">
                    {renderToggle(formData.isActive, (e) =>
                      setFormData({ ...formData, isActive: e.target.checked }),
                    )}
                    <span
                      className="text-sm font-bold"
                      style={{ color: formData.isActive ? BRAND : "#9ca3af" }}
                    >
                      Active
                    </span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-[#1a1a24] border-t border-border flex justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setShowEditor(false)}
                  className="px-4 py-2 rounded-xl text-sm font-bold border border-gray-300 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-sm font-bold text-white shadow-sm"
                  style={{ background: BRAND }}
                >
                  {editId ? "Update Block" : "Add Block"}
                </button>
              </div>
            </form>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
              <LayoutTemplate className="w-12 h-12 mb-4 opacity-20" style={{ color: BRAND }} />
              <h3 className="font-bold text-lg text-gray-600 dark:text-gray-300">
                Select a Block to Edit
              </h3>
              <p className="text-sm text-gray-400 mt-2">
                Click edit on a content block or add a new one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
