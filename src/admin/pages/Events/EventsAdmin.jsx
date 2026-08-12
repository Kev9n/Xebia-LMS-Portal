import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CalendarDays, Plus, Search, Trash2, Edit3, MapPin, Clock, Users, Eye, X,
  Zap, TrendingUp, AlertCircle, CheckCircle2, Timer, ArrowRight,
} from "lucide-react";
import { EventService } from "@/services/api";
import { useRouter } from "@tanstack/react-router";
import { clsx } from "clsx";
import CreateEvent from "./CreateEvent";

const STATUS_CONFIG = {
  upcoming: { bg: "bg-gradient-to-r from-blue-500 to-blue-600", text: "Upcoming", dot: "bg-blue-400", ring: "ring-blue-500/20" },
  ongoing: { bg: "bg-gradient-to-r from-[#01AC9F] to-emerald-500", text: "Live Now", dot: "bg-[#01AC9F]", ring: "ring-[#01AC9F]/20" },
  completed: { bg: "bg-gradient-to-r from-gray-400 to-gray-500", text: "Completed", dot: "bg-gray-400", ring: "ring-gray-400/20" },
  cancelled: { bg: "bg-gradient-to-r from-red-500 to-red-600", text: "Cancelled", dot: "bg-red-400", ring: "ring-red-500/20" },
};

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState("");
  useEffect(() => {
    if (!targetDate) return;
    const update = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) { setTimeLeft("Passed"); return; }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      if (d > 0) setTimeLeft(`${d}d ${h}h`);
      else if (h > 0) setTimeLeft(`${h}h ${m}m`);
      else setTimeLeft(`${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

function EventCountdown({ deadline, status }) {
  const timeLeft = useCountdown(deadline);
  const isUrgent = new Date(deadline) - new Date() < 172800000 && new Date(deadline) > new Date();
  if (status === "completed" || !timeLeft || timeLeft === "Passed") return null;
  return (
    <div className={clsx("flex items-center gap-1.5 text-[11px] font-bold", isUrgent ? "text-red-500" : "text-[#01AC9F]")}>
      <Timer className="w-3 h-3" />
      {isUrgent ? "Ending soon" : `Reg. closes in ${timeLeft}`}
    </div>
  );
}

const KpiCard = ({ title, value, icon: Icon, color, bg, subtitle, delay = 0 }) => (
  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay }}
    className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] shadow-sm p-5 hover:shadow-md transition-all group">
    <div className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-1">{title}</p>
        <p className="text-3xl font-black text-gray-900 dark:text-white leading-none">{value}</p>
        {subtitle && <p className="text-[11px] text-gray-400 mt-1">{subtitle}</p>}
      </div>
      <div className={clsx("w-11 h-11 rounded-xl flex items-center justify-center shrink-0", bg)}>
        <Icon className={clsx("w-5 h-5", color)} />
      </div>
    </div>
  </motion.div>
);

export default function EventsAdmin() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [view, setView] = useState("list"); // "list" | "create" | "edit"
  const [editData, setEditData] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => { fetchEvents(); }, []);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await EventService.getEvents();
      setEvents(Array.isArray(data) ? data : []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const filtered = events.filter((e) => {
    if (statusFilter !== "All" && e.status !== statusFilter.toLowerCase()) return false;
    if (search && !(e.title || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalReg = events.reduce((s, e) => s + (e.registrationCount || 0), 0);
  const upcomingCount = events.filter((e) => e.status === "upcoming").length;
  const ongoingCount = events.filter((e) => e.status === "ongoing").length;

  const handleDelete = async (id) => {
    try { await EventService.deleteEvent(id); setEvents((p) => p.filter((e) => e.id !== id)); setDeleteConfirm(null); } catch (err) { console.error(err); }
  };

  const handleEdit = (event) => { setEditData(event); setView("edit"); };

  // Create/Edit page
  if (view === "create" || view === "edit") {
    return <CreateEvent editData={view === "edit" ? editData : null} onBack={() => { setView("list"); setEditData(null); fetchEvents(); }} />;
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-100 dark:border-[#2e2e3e] p-5 h-[100px] animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      {/* Hero Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#6C1D5F] via-[#84117C] to-[#4A1E47] rounded-2xl p-8 text-white">
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-2xl"></div>
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
                <CalendarDays className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest text-white/70">Event Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Events Management</h1>
            <p className="text-sm text-white/70 mt-1">Create, manage, and track all events across the LMS.</p>
          </div>
          <button onClick={() => setView("create")}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#6C1D5F] text-sm font-bold rounded-xl hover:bg-white/90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 shrink-0">
            <Plus className="w-4 h-4" /> Create Event
          </button>
        </div>
      </motion.div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Total Events" value={events.length} icon={CalendarDays} color="text-[#6C1D5F]" bg="bg-[#6C1D5F]/10" delay={0} />
        <KpiCard title="Upcoming" value={upcomingCount} icon={Zap} color="text-blue-600" bg="bg-blue-50" delay={0.05} />
        <KpiCard title="Live Now" value={ongoingCount} icon={TrendingUp} color="text-[#01AC9F]" bg="bg-[#01AC9F]/10" delay={0.1} />
        <KpiCard title="Registrations" value={totalReg} icon={Users} color="text-[#FF6200]" bg="bg-[#FF6200]/10" subtitle="across all events" delay={0.15} />
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events by title..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-[#2e2e3e] hidden sm:block mx-2"></div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["All", "Upcoming", "Ongoing", "Completed"].map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={clsx("px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all",
                statusFilter === s ? "bg-[#6C1D5F] text-white" : "bg-gray-100 dark:bg-[#1a1a24] text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              )}>{s}</button>
          ))}
        </div>
        <span className="text-xs font-bold text-gray-400 px-3">{filtered.length} events</span>
      </div>

      {/* Events Grid — Amazon deal card style */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          <AnimatePresence>
            {filtered.map((event, idx) => {
              const st = STATUS_CONFIG[event.status] || STATUS_CONFIG.upcoming;
              return (
                <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3, delay: idx * 0.04 }}
                  whileHover={{ y: -8, boxShadow: "0 20px 40px -12px rgba(108,29,95,0.2)" }}
                  className="group relative bg-white dark:bg-[#15151f] rounded-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-[#2e2e3e] hover:border-[#6C1D5F]/40 dark:hover:border-[#84117C]/40 shadow-sm transition-all duration-300 cursor-pointer">

                  {/* Image + Status Ribbon */}
                  <div className="relative h-44 shrink-0 overflow-hidden bg-gradient-to-br from-[#6C1D5F]/5 to-[#84117C]/5">
                    {event.imageUrl ? (
                      <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6C1D5F]/10 to-[#84117C]/10">
                        <CalendarDays className="w-16 h-16 text-[#6C1D5F]/20" />
                      </div>
                    )}
                    {/* Status Badge */}
                    <div className="absolute top-3 left-3">
                      <span className={clsx("text-xs font-bold px-3 py-1.5 rounded-lg text-white shadow-lg uppercase tracking-wider", st.bg)}>
                        {event.status === "ongoing" && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1.5 animate-pulse"></span>}
                        {st.text}
                      </span>
                    </div>
                    {/* Deadline countdown */}
                    {event.status === "upcoming" && event.registrationDeadline && (
                      <div className="absolute top-3 right-3">
                        <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1.5 rounded-lg">
                          <EventCountdown deadline={event.registrationDeadline} status={event.status} />
                        </div>
                      </div>
                    )}
                    {/* Capacity bar */}
                    {event.maxCapacity && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/40 backdrop-blur-sm px-3 py-2">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-white/80">{event.registrationCount || 0}/{event.maxCapacity} spots</span>
                          <span className="text-xs font-bold text-white/60">{Math.round(((event.registrationCount || 0) / event.maxCapacity) * 100)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-1.5">
                          <div className="bg-gradient-to-r from-[#01AC9F] to-emerald-400 h-1.5 rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(((event.registrationCount || 0) / event.maxCapacity) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 flex flex-col p-5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2 group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors">
                      {event.title}
                    </h3>
                    {event.description && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">{event.description}</p>
                    )}
                    <div className="space-y-1.5 mb-4">
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                        {new Date(event.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {" — "}
                        {new Date(event.endDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {event.location}
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                        <Users className="w-3.5 h-3.5 text-gray-400" /> {event.registrationCount || 0} registered
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 pt-3 border-t border-gray-100 dark:border-[#2e2e3e] mt-auto">
                      <button onClick={() => router.navigate({ to: `/admin/events/${event.id}/registrations` })}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2 min-h-[40px] text-xs font-bold text-[#6C1D5F] bg-[#6C1D5F]/5 rounded-xl hover:bg-[#6C1D5F]/10 transition-colors">
                        <Eye className="w-3.5 h-3.5" /> Registrants
                      </button>
                      <button onClick={() => handleEdit(event)}
                        className="p-2 min-h-[40px] rounded-xl bg-gray-100 dark:bg-[#1a1a24] hover:bg-gray-200 dark:hover:bg-[#252535] text-gray-600 dark:text-gray-400 transition-colors">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteConfirm(event)}
                        className="p-2 min-h-[40px] rounded-xl bg-gray-100 dark:bg-[#1a1a24] hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-600 dark:text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm py-20 text-center">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1">No events found</p>
          <p className="text-xs text-gray-400 mb-4">{search ? "Try a different search" : "Create your first event to get started"}</p>
          {!search && (
            <button onClick={() => setView("create")}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#6C1D5F] text-white text-sm font-bold rounded-xl hover:bg-[#5a184f] transition-colors">
              <Plus className="w-4 h-4" /> Create Event
            </button>
          )}
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-[#15151f] rounded-2xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Event</h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              Are you sure you want to delete "{deleteConfirm.title}"?
              {deleteConfirm.registrationCount > 0 && ` ${deleteConfirm.registrationCount} student(s) are registered.`}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1a24] rounded-xl hover:bg-gray-200 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm.id)} className="px-4 py-2 text-sm font-bold text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
