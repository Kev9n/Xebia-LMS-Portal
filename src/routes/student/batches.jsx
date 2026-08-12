import { createFileRoute } from "@tanstack/react-router";
import { Users, Calendar, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { clsx } from "clsx";
import { motion } from "framer-motion";
import { useLMS } from "@/context/LMSContext";

export const Route = createFileRoute("/student/batches")({
  component: BatchesPage,
});

function BatchesPage() {
  const { batches, currentUser } = useLMS();
  const myBatches = (batches || []).filter((b) => (b.students || []).includes(currentUser?.id));

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-500">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6C1D5F] via-[#84117C] to-[#01AC9F] p-6 sm:p-8 text-white shadow-lg"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">My Batches</h1>
          <p className="mt-2 text-white/80 text-sm font-medium">
            {myBatches.length > 0
              ? `You're enrolled in ${myBatches.length} batch${myBatches.length !== 1 ? "es" : ""}`
              : "No batches assigned yet"}
          </p>
        </div>
      </motion.div>

      {/* Batch Cards */}
      {myBatches.length === 0 ? (
        <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-16 text-center">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-[#6C1D5F]/10 flex items-center justify-center">
            <Users className="w-6 h-6 text-[#6C1D5F]" />
          </div>
          <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">No batches found</p>
          <p className="text-xs text-gray-400 mt-1">You haven't been enrolled in any batch yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myBatches.map((batch, idx) => {
            const isActive = batch.status === "active";
            const studentCount = (batch.students || []).length;
            const hasImage = batch.icon && (batch.icon.startsWith("data:image") || batch.icon.startsWith("http"));

            return (
              <motion.div
                key={batch.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Cover Image or Gradient */}
                {hasImage ? (
                  <div className="relative h-28 w-full overflow-hidden">
                    <img src={batch.icon} alt="" className="w-full h-full object-cover" onError={(e) => { e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                    <div className="w-full h-full bg-gradient-to-br from-[#6C1D5F] to-[#01AC9F] items-center justify-center hidden">
                      <span className="text-3xl">📚</span>
                    </div>
                  </div>
                ) : (
                  <div className="h-28 w-full bg-gradient-to-br from-[#6C1D5F]/10 via-[#84117C]/5 to-[#01AC9F]/10 flex items-center justify-center">
                    <span className="text-3xl">{batch.icon || "📚"}</span>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3 z-10">
                  <span className={clsx(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm",
                    isActive
                      ? "bg-[#01AC9F]/10 text-[#01AC9F] border border-[#01AC9F]/20"
                      : "bg-gray-100 text-gray-500 border border-gray-200"
                  )}>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#01AC9F] animate-pulse" />}
                    {batch.status ? batch.status.charAt(0).toUpperCase() + batch.status.slice(1) : "Unknown"}
                  </span>
                </div>

                <div className="p-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">{batch.name}</h3>
                  <p className="text-xs font-semibold text-[#6C1D5F] mt-0.5 truncate">{batch.course || "No course"}</p>

                  {/* Info Row */}
                  <div className="flex items-center justify-between mt-3 text-xs text-gray-400 dark:text-gray-500">
                    <span className="flex items-center gap-1 font-bold">
                      <Users className="w-3 h-3 text-[#01AC9F]" /> {studentCount} enrolled
                    </span>
                    <span className="flex items-center gap-1 font-semibold">
                      <Calendar className="w-3 h-3" /> {batch.startDate || "No date"}
                    </span>
                  </div>

                  {/* Footer */}
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-[#2e2e3e] flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      +{studentCount} Classmates
                    </span>
                    <button className="flex items-center gap-1 px-3 py-2.5 min-h-[44px] bg-[#FF6200] hover:bg-[#FF6200]/90 text-white text-xs font-bold rounded-full transition-all shadow-sm shadow-[#FF6200]/20">
                      View <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
