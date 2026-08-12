import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CalendarDays, MapPin, Clock, Users, Search, Eye, X, Globe, Building2, Sparkles, Timer, ArrowRight,
} from "lucide-react";
import { EventService } from "@/services/api";
import { clsx } from "clsx";

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
      setTimeLeft(d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m}m` : `${m}m`);
    };
    update();
    const id = setInterval(update, 60000);
    return () => clearInterval(id);
  }, [targetDate]);
  return timeLeft;
}

export default function EventsTrainer() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [tabFilter, setTabFilter] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    EventService.getEvents()
      .then((d) => setEvents(Array.isArray(d) ? d : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = events.filter((e) => {
    if (search && !(e.title || "").toLowerCase().includes(search.toLowerCase())) return false;
    if (tabFilter === "Upcoming") return e.status === "upcoming";
    if (tabFilter === "Ongoing") return e.status === "ongoing";
    if (tabFilter === "Completed") return e.status === "completed";
    return true;
  });

  if (loading) {
    return (
      <div className="space-y-4 animate-in fade-in duration-500 pb-6">
        <div className="h-32 bg-gradient-to-br from-[#6C1D5F] to-[#84117C] rounded-2xl animate-pulse"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="bg-white dark:bg-[#15151f] rounded-2xl h-[340px] animate-pulse" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-6">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-[#6C1D5F] via-[#84117C] to-[#4A1E47] rounded-2xl p-8 text-white">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
            <CalendarDays className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Events</h1>
            <p className="text-sm text-white/70 mt-1">Browse all events across the LMS.</p>
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <div className="bg-white dark:bg-[#15151f] border border-gray-200 dark:border-[#2e2e3e] rounded-2xl shadow-sm p-2 flex flex-col sm:flex-row items-center gap-2">
        <div className="relative flex-1 w-full min-w-[200px]">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search events..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none" />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["All", "Upcoming", "Ongoing", "Completed"].map((s) => (
            <button key={s} onClick={() => setTabFilter(s)}
              className={clsx("px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all",
                tabFilter === s ? "bg-[#6C1D5F] text-white" : "bg-gray-100 dark:bg-[#1a1a24] text-gray-600 dark:text-gray-400 hover:bg-gray-200"
              )}>{s}</button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((event, idx) => {
            const isUpcoming = event.status === "upcoming";
            return (
              <motion.div key={event.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="group relative bg-white dark:bg-[#15151f] rounded-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-[#2e2e3e] hover:border-[#6C1D5F]/30 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 cursor-pointer"
                onClick={() => setSelectedEvent(event)}>

                <div className="relative h-44 shrink-0 overflow-hidden">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#6C1D5F]/10 to-[#84117C]/10">
                      <CalendarDays className="w-16 h-16 text-[#6C1D5F]/20" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span className={clsx("text-[10px] font-bold px-2.5 py-1.5 rounded-lg text-white shadow-lg uppercase tracking-wider",
                      event.status === "ongoing" ? "bg-gradient-to-r from-[#01AC9F] to-emerald-500" :
                      event.status === "completed" ? "bg-gradient-to-r from-gray-400 to-gray-500" :
                      "bg-gradient-to-r from-blue-500 to-blue-600")}>
                      {event.status === "ongoing" && <span className="inline-block w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>}
                      {event.status}
                    </span>
                  </div>
                  {isUpcoming && event.registrationDeadline && (
                    <div className="absolute top-3 right-3">
                      <div className="bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1.5 rounded-lg flex items-center gap-1">
                        <Timer className="w-3 h-3" />
                        {new Date(event.registrationDeadline) > new Date() ? `Reg. closes ${new Date(event.registrationDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric" })}` : "Closed"}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 flex flex-col p-5">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white leading-tight line-clamp-2 mb-2 group-hover:text-[#6C1D5F] dark:group-hover:text-[#84117C] transition-colors">{event.title}</h3>
                  <div className="space-y-1.5 mb-4">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      <Clock className="w-3.5 h-3.5" /> {new Date(event.startDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })} — {new Date(event.endDateTime).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    {event.location && <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400"><MapPin className="w-3.5 h-3.5" /> {event.location}</div>}
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 dark:text-gray-400">
                      {event.isOnline ? <Globe className="w-3.5 h-3.5" /> : <Building2 className="w-3.5 h-3.5" />}
                      {event.isOnline ? "Online" : "In-Person"}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-[#2e2e3e] mt-auto">
                    <span className="text-xs font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                      <Users className="w-4 h-4" /> {event.registrationCount || 0} registered
                    </span>
                    <span className="text-xs font-bold text-[#6C1D5F] dark:text-[#84117C] flex items-center gap-1 group-hover:gap-2 transition-all">
                      View Details <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm py-20 text-center">
          <CalendarDays className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-500">No events found</p>
        </div>
      )}

      {/* Detail Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setSelectedEvent(null)}>
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#15151f] rounded-2xl max-w-lg w-full mx-4 shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {selectedEvent.imageUrl && <img src={selectedEvent.imageUrl} alt={selectedEvent.title} className="w-full h-48 object-cover rounded-t-2xl" />}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedEvent.title}</h2>
                <button onClick={() => setSelectedEvent(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-[#252535] text-gray-500"><X className="w-5 h-5" /></button>
              </div>
              {selectedEvent.description && <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{selectedEvent.description}</p>}
              <div className="space-y-2.5 text-sm text-gray-600 dark:text-gray-400">
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-400" /> {new Date(selectedEvent.startDateTime).toLocaleString()} — {new Date(selectedEvent.endDateTime).toLocaleString()}</p>
                {selectedEvent.location && <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-gray-400" /> {selectedEvent.location}</p>}
                <p className="flex items-center gap-2"><Users className="w-4 h-4 text-gray-400" /> {selectedEvent.registrationCount || 0} registered</p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
