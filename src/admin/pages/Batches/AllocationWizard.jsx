import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, BookOpen, GraduationCap, CheckCircle, ArrowRight, ArrowLeft,
  Search, Sparkles, User, Bookmark, Clock, MapPin,
} from "lucide-react";
import { AllocationService, UserService, BatchService, CourseService } from "@/services/api";
import { DateTimePicker } from "@/components/ui/DateTimePicker";
import { useRouter } from "@tanstack/react-router";
import { clsx } from "clsx";

const STEPS = [
  { id: 1, title: "Select Batch", icon: BookOpen, description: "Choose a batch" },
  { id: 2, title: "Select Trainer", icon: Users, description: "Assign a trainer" },
  { id: 3, title: "Select Course", icon: GraduationCap, description: "Choose course(s)" },
  { id: 4, title: "Review & Assign", icon: CheckCircle, description: "Confirm allocation" },
];

export default function AllocationWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Data
  const [batches, setBatches] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [courses, setCourses] = useState([]);

  // Selections
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedCourses, setSelectedCourses] = useState([]);
  const [allocatedCourseIds, setAllocatedCourseIds] = useState(new Set());
  const [academicSession, setAcademicSession] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [notes, setNotes] = useState("");

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [batchData, trainerData, courseData] = await Promise.all([
        BatchService.getBatches().catch(() => []),
        UserService.getUsers("teacher").catch(() => []),
        CourseService.getCourses().catch(() => []),
      ]);

      setBatches(Array.isArray(batchData) ? batchData : []);
      setTrainers(Array.isArray(trainerData) ? trainerData : []);
      setCourses(Array.isArray(courseData) ? courseData : []);
    } catch (err) {
      console.error("Failed to load data:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBatches = batches.filter((b) => {
    // Only show batches that have a valid creator still in the system
    if (!b.createdBy || b.createdBy.trim() === "") return false;
    if (!trainers.find((t) => t.id === b.createdBy)) return false;
    if (search) return (b.name || "").toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredTrainers = trainers.filter((t) => {
    if (search) return (t.name || "").toLowerCase().includes(search.toLowerCase()) || (t.email || "").toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const filteredCourses = courses.filter((c) => {
    if (allocatedCourseIds.has(c.id)) return false;
    if (search) return (c.title || "").toLowerCase().includes(search.toLowerCase());
    return true;
  });

  // Find trainer from batch createdBy
  const batchCreatorTrainer = selectedBatch?.createdBy
    ? trainers.find((t) => t.id === selectedBatch.createdBy) || null
    : null;

  // Auto-select batch creator when entering Step 2
  useEffect(() => {
    if (currentStep === 2 && batchCreatorTrainer && !selectedTrainer) {
      setSelectedTrainer(batchCreatorTrainer);
    }
  }, [currentStep, batchCreatorTrainer]);

  // Fetch existing allocations for selected batch to filter out already-allocated courses
  useEffect(() => {
    if (!selectedBatch) return;
    AllocationService.getAllocations({ batchId: selectedBatch.id })
      .then((allocs) => {
        const ids = new Set(
          (Array.isArray(allocs) ? allocs : [])
            .filter((a) => a.status === "active")
            .map((a) => a.courseId)
        );
        setAllocatedCourseIds(ids);
      })
      .catch(() => setAllocatedCourseIds(new Set()));
  }, [selectedBatch]);

  const toggleCourseSelection = (course) => {
    setSelectedCourses((prev) => {
      const exists = prev.find((c) => c.id === course.id);
      if (exists) return prev.filter((c) => c.id !== course.id);
      return [...prev, course];
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedBatch;
      case 2: return !!selectedTrainer && !!batchCreatorTrainer;
      case 3: return selectedCourses.length > 0;
      case 4: return !!academicSession;
      default: return false;
    }
  };

  const handleAssign = async () => {
    setSubmitting(true);
    try {
      const allocations = selectedCourses.map((course) => ({
        trainerId: selectedTrainer.id,
        batchId: selectedBatch.id,
        courseId: course.id,
        academicSession,
        startDate,
        endDate,
        status: "active",
        notes,
        assignedAt: new Date().toISOString(),
      }));

      await AllocationService.createBulkAllocations(allocations);

      // Send notification to the trainer
      try {
        const courseNames = selectedCourses.map((c) => c.title).join(", ");
        const notifications = JSON.parse(localStorage.getItem("notifications") || "[]");
        notifications.unshift({
          id: `NOTIF-${Date.now()}`,
          title: "Course Allocated",
          message: `Admin has allocated course${selectedCourses.length > 1 ? "s" : ""} "${courseNames}" to batch "${selectedBatch.name}". You can now create assessments for this batch.`,
          type: "allocation",
          createdAt: new Date().toISOString(),
          isRead: false,
          recipientId: selectedTrainer.id,
        });
        localStorage.setItem("notifications", JSON.stringify(notifications));
      } catch (e) { /* notification is best-effort */ }

      router.navigate({ to: "/admin/batches/allocations" });
    } catch (err) {
      console.error("Failed to create allocations:", err);
      alert("Failed to create allocations. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-6 h-[400px] animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-40 mb-6"></div>
          <div className="h-full bg-gray-100 dark:bg-gray-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Course Allocation Wizard
          </h1>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
            Assign courses to trainers and batches in a few simple steps.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6">
        <div className="flex items-center justify-between">
          {STEPS.map((step, idx) => (
            <React.Fragment key={step.id}>
              <button
                onClick={() => step.id < currentStep && setCurrentStep(step.id)}
                className={clsx(
                  "flex items-center gap-3 transition-all",
                  step.id <= currentStep ? "opacity-100" : "opacity-40",
                  step.id === currentStep && "scale-105"
                )}
              >
                <div className={clsx(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all",
                  step.id < currentStep ? "bg-[#01AC9F] text-white" :
                  step.id === currentStep ? "bg-[#6C1D5F] text-white shadow-lg" :
                  "bg-gray-100 dark:bg-[#1a1a24] text-gray-400"
                )}>
                  {step.id < currentStep ? <CheckCircle className="w-5 h-5" /> : <step.icon className="w-5 h-5" />}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={clsx("text-xs font-bold", step.id === currentStep ? "text-[#6C1D5F]" : "text-gray-500")}>
                    Step {step.id}
                  </p>
                  <p className={clsx("text-sm font-bold", step.id === currentStep ? "text-gray-900 dark:text-white" : "text-gray-400")}>
                    {step.title}
                  </p>
                </div>
              </button>
              {idx < STEPS.length - 1 && (
                <div className={clsx("flex-1 h-0.5 mx-2 rounded", step.id < currentStep ? "bg-[#01AC9F]" : "bg-gray-200 dark:bg-[#2e2e3e]")} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-6"
        >
          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`Search ${STEPS[currentStep - 1].title.toLowerCase()}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#1a1a24] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] transition-all"
            />
          </div>

          {/* Step 1: Select Batch */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Select a batch created by a trainer in the trainer portal.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredBatches.length > 0 ? filteredBatches.map((batch) => {
                  const isSelected = selectedBatch?.id === batch.id;
                  const hasImage = batch.icon && (batch.icon.startsWith("data:image") || batch.icon.startsWith("http"));
                  return (
                  <button
                    key={batch.id}
                    onClick={() => setSelectedBatch(batch)}
                    className={clsx(
                      "relative rounded-xl overflow-hidden flex flex-col text-left transition-all duration-300",
                      isSelected
                        ? "ring-2 ring-[#6C1D5F] shadow-[0_0_20px_rgba(108,29,95,0.15)]"
                        : "shadow-sm hover:shadow-xl hover:-translate-y-1"
                    )}
                  >
                    {/* Cover Image or Gradient Header */}
                    {hasImage ? (
                      <div className="relative h-32 w-full overflow-hidden">
                        <img src={batch.icon} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                        <div className="w-full h-full bg-gradient-to-br from-[#6C1D5F] to-[#01AC9F] items-center justify-center hidden">
                          <span className="text-4xl">📚</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-32 w-full bg-gradient-to-br from-[#6C1D5F]/10 via-[#84117C]/5 to-[#01AC9F]/10 flex items-center justify-center">
                        <span className="text-4xl">{batch.icon || "📚"}</span>
                      </div>
                    )}

                    {/* Status Badge */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="inline-block px-2 py-0.5 font-bold rounded-md text-[9px] uppercase font-mono shadow-sm bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F] dark:text-white border border-[#01AC9F]/20 dark:border-[#01AC9F]">
                        {batch.status}
                      </span>
                    </div>

                    <div className="p-4 bg-white dark:bg-[#15151f]">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{batch.name}</p>
                      <p className="mt-1 text-xs font-semibold text-gray-500 dark:text-gray-400 truncate">{batch.course || "No course focus"}</p>

                      <div className="mt-3 flex items-center justify-between text-[10px] text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1 font-bold">
                          <Users className="w-3.5 h-3.5 text-[#01AC9F]" /> {batch.studentCount || 0} Enrolled
                        </span>
                        {batch.createdByName && (
                          <span className="flex items-center gap-1 font-semibold text-[#6C1D5F]">
                            <User className="w-3 h-3" />
                            {batch.createdByName}
                          </span>
                        )}
                      </div>
                    </div>

                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-[#6C1D5F] rounded-xl pointer-events-none" />
                    )}
                  </button>
                  );
                }) : (
                  <div className="col-span-full text-center py-12 text-gray-400">
                    <BookOpen className="w-8 h-8 mx-auto mb-3" />
                    <p>No batches found</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2: Select Trainer — Only batch creator allowed */}
          {currentStep === 2 && (
            <div className="space-y-4">
              {batchCreatorTrainer ? (
                <>
                  <div className="bg-[#01AC9F]/5 border border-[#01AC9F]/20 rounded-xl p-4">
                    <p className="text-sm font-bold text-[#01AC9F] mb-1">Batch Creator</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Only the batch creator can be allocated to this batch. This batch was created by{" "}
                      <span className="font-bold text-gray-900 dark:text-white">{batchCreatorTrainer.name}</span>.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <button
                      key={batchCreatorTrainer.id}
                      onClick={() => setSelectedTrainer(batchCreatorTrainer)}
                      className={clsx(
                        "p-5 rounded-xl border-2 text-left transition-all hover:shadow-md",
                        selectedTrainer?.id === batchCreatorTrainer.id
                          ? "border-[#01AC9F] bg-[#01AC9F]/5 shadow-[0_0_20px_rgba(1,172,159,0.15)]"
                          : "border-[#01AC9F]/30 hover:border-[#01AC9F]/50"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {batchCreatorTrainer.avatar ? (
                          <img src={batchCreatorTrainer.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-[#01AC9F]/20 flex items-center justify-center text-[#01AC9F] font-bold text-sm">
                            {batchCreatorTrainer.name?.charAt(0) || "?"}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{batchCreatorTrainer.name}</p>
                          <p className="text-xs text-gray-500">{batchCreatorTrainer.email}</p>
                          <p className="text-xs text-[#01AC9F] font-bold mt-0.5">Batch Creator</p>
                        </div>
                      </div>
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm font-bold text-gray-500 dark:text-gray-400">No batch creator found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    This batch has no registered creator. Please go back and recreate the batch from the trainer portal.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Select Course */}
          {currentStep === 3 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.length > 0 ? filteredCourses.map((course, idx) => {
                const isSelected = selectedCourses.find((c) => c.id === course.id);
                const thumb = course.thumbnailImageUrl || course.thumbnail || course.icon;
                const level = course.difficultyLevel || "Beginner";
                const levelColor = level === "Beginner" ? "#01AC9F" : level === "Intermediate" ? "#84117C" : "#FF6200";
                return (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    whileHover={{ y: -4, boxShadow: "0 12px 30px -8px rgba(0,0,0,0.15)" }}
                    onClick={() => toggleCourseSelection(course)}
                    className={clsx(
                      "group rounded-2xl flex flex-col h-full overflow-hidden cursor-pointer transition-all duration-300 border-[3px]",
                      isSelected
                        ? "border-[#01AC9F] bg-white dark:bg-[#15151f] shadow-[0_0_20px_rgba(1,172,159,0.2)]"
                        : "border-gray-100 dark:border-[#2e2e3e] bg-white dark:bg-[#15151f] hover:border-[#01AC9F]/40"
                    )}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-32 bg-gray-100 dark:bg-gray-800 overflow-hidden shrink-0">
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500 z-0">
                        <span className="text-4xl font-bold opacity-20 uppercase tracking-wider">
                          {course.title ? course.title.substring(0, 2) : "CO"}
                        </span>
                      </div>
                      {thumb && (
                        <img
                          src={thumb}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-10"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      )}
                      {/* Selected checkmark */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 z-20">
                          <div className="w-7 h-7 rounded-full bg-[#01AC9F] flex items-center justify-center shadow-lg">
                            <CheckCircle className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                      {/* Level badge */}
                      <div className="absolute top-3 left-3 z-20">
                        <span className="text-[10px] font-bold px-2 py-1 rounded-md shadow-sm text-white" style={{ background: levelColor }}>
                          {level}
                        </span>
                      </div>
                    </div>
                    {/* Body */}
                    <div className="p-4 flex-1 flex flex-col">
                      <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-1 group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors">
                        {course.title}
                      </p>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-2">
                        {course.description || course.subtitle || "No description"}
                      </p>
                      <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#2e2e3e]">
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                          {course.language || "English"}
                        </span>
                        {course.durationHours && (
                          <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {course.durationHours}h
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-full text-center py-12 text-gray-400">
                  <GraduationCap className="w-8 h-8 mx-auto mb-3" />
                  <p>No courses found</p>
                </div>
              )}
            </div>
          )}

          {/* Step 4: Review */}
          {currentStep === 4 && (
            <div className="space-y-4">
              {/* Allocation Summary + Schedule side by side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: Allocation Summary */}
                <div className="bg-gray-50 dark:bg-[#1a1a24] rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Allocation Summary</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16 shrink-0">Batch</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedBatch?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16 shrink-0">Trainer</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">{selectedTrainer?.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-500 w-16 shrink-0">Courses</span>
                      <span className="text-sm font-bold text-[#01AC9F]">{selectedCourses.length} selected</span>
                    </div>
                  </div>
                </div>

                {/* Right: Schedule */}
                <div className="bg-gray-50 dark:bg-[#1a1a24] rounded-xl p-4">
                  <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Schedule</h3>
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 mb-1 block">Academic Session *</label>
                      <input type="text" value={academicSession} onChange={(e) => setAcademicSession(e.target.value)} placeholder="e.g., 2023-2027" className="w-full px-3 py-2 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F]" />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">Start Date</label>
                        <DateTimePicker type="date" value={startDate} onChange={setStartDate} />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 mb-1 block">End Date</label>
                        <DateTimePicker type="date" value={endDate} onChange={setEndDate} />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 mb-1 block">Notes</label>
                      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes..." rows={2} className="w-full px-3 py-2 bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-[#6C1D5F]/20 focus:border-[#6C1D5F] resize-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Courses List */}
              <div className="bg-gray-50 dark:bg-[#1a1a24] rounded-xl p-4">
                <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Selected Courses</h3>
                <div className="space-y-2">
                  {selectedCourses.map((course) => {
                    const thumb = course.thumbnailImageUrl || course.thumbnail || course.icon;
                    return (
                      <div key={course.id} className="flex items-center gap-3 p-3 bg-white dark:bg-[#15151f] rounded-xl border border-gray-100 dark:border-[#2e2e3e]">
                        {thumb ? (
                          <img src={thumb} alt={course.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-[#6C1D5F]/10 flex items-center justify-center shrink-0">
                            <GraduationCap className="w-5 h-5 text-[#6C1D5F]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{course.title}</p>
                          <p className="text-[10px] text-gray-500">{course.difficultyLevel || "Beginner"} · {course.language || "English"}</p>
                        </div>
                        <button onClick={() => toggleCourseSelection(course)} className="text-xs font-bold text-red-500 hover:text-red-700 px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">Remove</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
          disabled={currentStep === 1}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-[#1a1a24] hover:bg-gray-200 dark:hover:bg-[#252535] text-sm font-bold text-gray-700 dark:text-gray-300 rounded-xl transition-colors disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        {currentStep < 4 ? (
          <button
            onClick={() => setCurrentStep((s) => Math.min(4, s + 1))}
            disabled={!canProceed()}
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#6C1D5F] hover:bg-[#5a184f] text-white text-sm font-bold rounded-xl transition-all shadow-[0_2px_10px_-2px_rgba(108,29,95,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleAssign}
            disabled={!canProceed() || submitting}
            className="inline-flex items-center gap-2 px-8 py-2.5 bg-[#01AC9F] hover:bg-[#009989] text-white text-sm font-bold rounded-xl transition-all shadow-[0_2px_10px_-2px_rgba(1,172,159,0.4)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Assigning...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Assign {selectedCourses.length} Course{selectedCourses.length !== 1 ? "s" : ""}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
