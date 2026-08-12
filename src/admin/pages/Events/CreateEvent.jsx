import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, CalendarDays, MapPin, Clock, Upload, Globe, Building2, Users, Image, Sparkles, FileEdit, Save, Camera, X, Link as LinkIcon, Wand2, Loader2,
} from "lucide-react";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { EventService } from "@/services/api";
import { AIService } from "@/services/aiService";
import { useRouter } from "@tanstack/react-router";
import { clsx } from "clsx";

const cardHover = { whileHover: { y: -2, boxShadow: "0 8px 25px -5px rgba(0,0,0,0.1)" } };

function parseDateTime(dtStr) {
  if (!dtStr) return { date: "", time: "" };
  const d = new Date(dtStr);
  if (isNaN(d)) return { date: "", time: "" };
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const h = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return { date: `${y}-${m}-${day}`, time: `${h}:${min}` };
}

function combineDateTime(date, time) {
  if (!date) return null;
  return new Date(`${date}T${time || "00:00"}:00`).toISOString();
}

function formatDisplay(date, time) {
  if (!date) return "";
  const d = new Date(`${date}T${time || "00:00"}`);
  if (isNaN(d)) return date;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + (time ? ` ${d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}` : "");
}

export default function CreateEvent({ editData, onBack }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [location, setLocation] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("");
  const [status, setStatus] = useState("upcoming");

  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");
  const [regDate, setRegDate] = useState("");
  const [regTime, setRegTime] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [imageMode, setImageMode] = useState("upload");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setDescription(editData.description || "");
      setImageUrl(editData.imageUrl || "");
      setIsOnline(editData.isOnline || false);
      setLocation(editData.location || "");
      setMaxCapacity(editData.maxCapacity || "");
      setStatus(editData.status || "upcoming");
      if (editData.imageUrl) { setImagePreview(editData.imageUrl); setImageMode("url"); }
      const sd = parseDateTime(editData.startDateTime);
      const ed = parseDateTime(editData.endDateTime);
      const rd = parseDateTime(editData.registrationDeadline);
      setStartDate(sd.date); setStartTime(sd.time);
      setEndDate(ed.date); setEndTime(ed.time);
      setRegDate(rd.date); setRegTime(rd.time);
    }
  }, [editData]);

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setImagePreview(ev.target.result); setImageUrl(ev.target.result); };
    reader.readAsDataURL(file);
  };

  const handleGenerateDescription = async () => {
    if (!title.trim()) { return; }
    setGeneratingDesc(true);
    try {
      const result = await AIService.generateEventDescription(title, location, isOnline);
      setDescription(result);
    } catch (err) {
      console.error("AI generation failed:", err);
    } finally { setGeneratingDesc(false); }
  };
  const handleSubmit = async (statusOverride) => {
    setSaving(true);
    try {
      const payload = {
        title, description, imageUrl, isOnline, location,
        status: statusOverride || status,
        startDateTime: combineDateTime(startDate, startTime),
        endDateTime: combineDateTime(endDate, endTime),
        registrationDeadline: combineDateTime(regDate, regTime),
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : null,
      };
      if (editData) await EventService.updateEvent(editData.id, payload);
      else {
        await EventService.createEvent(payload);
        // Notify all trainers about the new event
        try {
          const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
          notifications.unshift({
            id: `NOTIF-${Date.now()}`,
            title: "New Event Created",
            message: `Admin has created a new event "${title}". ${isOnline ? "Online" : ""} event starts ${startDate || "soon"}. Check Events page for details.`,
            type: "event",
            createdAt: new Date().toISOString(),
            isRead: false,
            recipientId: null,
          });
          localStorage.setItem("notifications", JSON.stringify(notifications));
        } catch (e) { /* best-effort */ }
      }
      if (onBack) onBack(); else router.navigate({ to: "/admin/events" });
    } catch (err) { console.error(err); } finally { setSaving(false); }
  };

  const inputCls = "w-full px-3 py-2 bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all placeholder-gray-400";
  const lbl = "text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1 block";
  const sectionCls = "bg-white dark:bg-[#15151f] rounded-xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-4 transition-all duration-200 hover:shadow-md hover:border-gray-200 dark:hover:border-[#3a3a4e]";

  return (
    <div className="animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white/80 dark:bg-[#15151f]/80 backdrop-blur-xl border-b border-gray-100 dark:border-[#2e2e3e]">
        <div className="flex items-center gap-3 px-6 py-2.5">
          <button onClick={onBack || (() => router.navigate({ to: "/admin/events" }))}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252535] transition-colors">
            <ArrowLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-base font-extrabold text-gray-900 dark:text-white">
            {editData ? "Edit Event" : "Create New Event"}
          </h1>
        </div>
      </div>

      {/* Form Grid */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-3">
            {/* Basic Info */}
            <motion.div {...cardHover} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.03 }} className={sectionCls}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center"><Sparkles className="w-4 h-4 text-[#6C1D5F]" /></div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Basic Information</h3>
              </div>
              <div className="space-y-2.5">
                <div>
                  <label className={lbl}>Event Title *</label>
                  <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. React Advanced Workshop" className={inputCls} />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className={lbl}>Description</label>
                    <button type="button" onClick={handleGenerateDescription} disabled={generatingDesc || !title.trim()}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold text-[#84117C] bg-[#84117C]/10 rounded-lg hover:bg-[#84117C]/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      title="Generate description with AI">
                      {generatingDesc ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                      {generatingDesc ? "Generating..." : "Generate with AI"}
                    </button>
                  </div>
                  <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what this event is about..." className={clsx(inputCls, "resize-none")} />
                </div>
              </div>
            </motion.div>

            {/* Schedule — DateTimePicker */}
            <motion.div {...cardHover} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className={sectionCls}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#01AC9F]/10 flex items-center justify-center"><Clock className="w-4 h-4 text-[#01AC9F]" /></div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Schedule & Deadline</h3>
              </div>
              <div className="space-y-3">
                {/* Start Date/Time */}
                <div>
                  <label className={lbl}>Start Date & Time *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DateTimePicker type="date" value={startDate} onChange={setStartDate} />
                    </div>
                    <div className="relative">
                      <DateTimePicker type="time" value={startTime} onChange={setStartTime} />
                    </div>
                  </div>
                  {startDate && <p className="text-[10px] text-[#01AC9F] font-medium mt-1">{formatDisplay(startDate, startTime)}</p>}
                </div>
                {/* End Date/Time */}
                <div>
                  <label className={lbl}>End Date & Time *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DateTimePicker type="date" value={endDate} onChange={setEndDate} />
                    </div>
                    <div className="relative">
                      <DateTimePicker type="time" value={endTime} onChange={setEndTime} />
                    </div>
                  </div>
                  {endDate && <p className="text-[10px] text-[#01AC9F] font-medium mt-1">{formatDisplay(endDate, endTime)}</p>}
                </div>
                {/* Registration Deadline */}
                <div>
                  <label className={lbl}>Registration Deadline *</label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="relative">
                      <DateTimePicker type="date" value={regDate} onChange={setRegDate} />
                    </div>
                    <div className="relative">
                      <DateTimePicker type="time" value={regTime} onChange={setRegTime} />
                    </div>
                  </div>
                  {regDate && <p className="text-[10px] text-[#FF6200] font-medium mt-1">Closes: {formatDisplay(regDate, regTime)}</p>}
                </div>
              </div>
            </motion.div>

            {/* Location */}
            <motion.div {...cardHover} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} className={sectionCls}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#FF6200]/10 flex items-center justify-center"><MapPin className="w-4 h-4 text-[#FF6200]" /></div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Location</h3>
              </div>
              <div className="space-y-2.5">
                <div className="flex items-center gap-3">
                  <button type="button" onClick={() => setIsOnline(false)}
                    className={clsx("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border-2 hover:scale-[1.02]",
                      !isOnline ? "border-[#6C1D5F] bg-[#6C1D5F]/5 text-[#6C1D5F] shadow-sm" : "border-gray-200 dark:border-[#2e2e3e] text-gray-500 hover:border-gray-300")}>
                    <Building2 className="w-3.5 h-3.5" /> In-Person
                  </button>
                  <button type="button" onClick={() => setIsOnline(true)}
                    className={clsx("flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200 border-2 hover:scale-[1.02]",
                      isOnline ? "border-[#01AC9F] bg-[#01AC9F]/5 text-[#01AC9F] shadow-sm" : "border-gray-200 dark:border-[#2e2e3e] text-gray-500 hover:border-gray-300")}>
                    <Globe className="w-3.5 h-3.5" /> Online
                  </button>
                </div>
                <input type="text" value={location} onChange={(e) => setLocation(e.target.value)}
                  placeholder={isOnline ? "https://meet.google.com/..." : "Enter venue address"} className={inputCls} />
              </div>
            </motion.div>

            {/* Actions — aligned with form grid */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="flex items-center justify-between pt-2">
              <button onClick={onBack || (() => router.navigate({ to: "/admin/events" }))}
                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a24] rounded-xl hover:bg-gray-200 dark:hover:bg-[#252535] transition-all duration-200 hover:scale-[1.02]">
                Cancel
              </button>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => handleSubmit("draft")} disabled={saving}
                  className={clsx("flex items-center gap-1.5 px-4 py-2 text-sm font-bold rounded-xl transition-all duration-200 border-2 hover:scale-[1.02]",
                    saving ? "border-gray-200 text-gray-400 cursor-not-allowed" : "border-[#FF6200] text-[#FF6200] hover:bg-[#FF6200]/5 hover:shadow-sm")}>
                  <FileEdit className="w-4 h-4" /> Draft
                </button>
                <button type="button" onClick={() => handleSubmit("upcoming")} disabled={saving}
                  className={clsx("flex items-center gap-1.5 px-5 py-2 text-sm font-bold text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:scale-[1.02]",
                    saving ? "bg-gray-400 cursor-not-allowed" : "bg-[#6C1D5F] hover:bg-[#5a184f]")}>
                  <Save className="w-4 h-4" /> {editData ? "Update" : "Publish"}
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-3">
            {/* Banner Image */}
            <motion.div {...cardHover} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 }} className={sectionCls}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-[#84117C]/10 flex items-center justify-center"><Image className="w-4 h-4 text-[#84117C]" /></div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Banner Image</h3>
              </div>
              {imagePreview ? (
                <div className="relative rounded-lg overflow-hidden mb-3 group/img">
                  <img src={imagePreview} alt="Preview" className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/40 transition-all duration-300 flex items-center justify-center opacity-0 group-hover/img:opacity-100">
                    <button type="button" onClick={() => { setImagePreview(null); setImageUrl(""); }}
                      className="p-2 bg-white/90 rounded-lg text-red-500 hover:bg-white transition-colors shadow-lg">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 dark:border-[#2e2e3e] rounded-lg text-center mb-3 overflow-hidden">
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    className="w-full p-5 hover:bg-gray-50 dark:hover:bg-[#1a1a24] transition-colors cursor-pointer group/upload">
                    <Camera className="w-8 h-8 text-gray-300 mx-auto mb-1.5 group-hover/upload:text-[#6C1D5F] transition-colors" />
                    <p className="text-[11px] font-bold text-gray-500 dark:text-gray-400 group-hover/upload:text-[#6C1D5F] transition-colors">Upload from device</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, GIF up to 5MB</p>
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2 mb-2">
                <button type="button" onClick={() => setImageMode("upload")}
                  className={clsx("flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
                    imageMode === "upload" ? "bg-[#6C1D5F]/10 text-[#6C1D5F]" : "bg-gray-100 dark:bg-[#1a1a24] text-gray-500 hover:bg-gray-200")}>
                  <Camera className="w-3 h-3" /> Upload
                </button>
                <button type="button" onClick={() => setImageMode("url")}
                  className={clsx("flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-all",
                    imageMode === "url" ? "bg-[#6C1D5F]/10 text-[#6C1D5F]" : "bg-gray-100 dark:bg-[#1a1a24] text-gray-500 hover:bg-gray-200")}>
                  <LinkIcon className="w-3 h-3" /> URL
                </button>
              </div>
              {imageMode === "url" && (
                <input type="url" value={imageUrl} onChange={(e) => { setImageUrl(e.target.value); setImagePreview(e.target.value || null); }}
                  placeholder="https://example.com/banner.jpg" className={inputCls} />
              )}
            </motion.div>

            {/* Capacity */}
            <motion.div {...cardHover} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.09 }} className={sectionCls}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center"><Users className="w-4 h-4 text-blue-500" /></div>
                <h3 className="text-xs font-bold text-gray-900 dark:text-white">Capacity</h3>
              </div>
              <input type="number" min="1" value={maxCapacity} onChange={(e) => setMaxCapacity(e.target.value)} placeholder="Leave empty for unlimited" className={inputCls} />
            </motion.div>

            {/* Preview */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="bg-gradient-to-br from-[#6C1D5F]/5 to-[#84117C]/5 dark:from-[#6C1D5F]/10 dark:to-[#84117C]/10 rounded-xl border border-[#6C1D5F]/10 p-4 transition-all duration-200 hover:shadow-md hover:scale-[1.01]">
              <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Preview</p>
              <div className="space-y-1">
                <p className="text-sm font-bold text-gray-900 dark:text-white line-clamp-1">{title || "Event Title"}</p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {startDate ? formatDisplay(startDate, startTime) : "Start date"} — {endDate ? formatDisplay(endDate, endTime) : "End date"}
                </p>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> {location || "Location"}</p>
                {maxCapacity && <p className="text-[11px] text-gray-500 flex items-center gap-1"><Users className="w-3 h-3" /> {maxCapacity} max</p>}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
