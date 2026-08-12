import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  GraduationCap,
  ShieldCheck,
  Trash2,
  Search,
  X,
  AlertTriangle,
  Loader2,
  CheckCircle2,
  UserX,
  BookOpen,
  ClipboardCheck,
  CalendarDays,
  Layers,
} from "lucide-react";
import { UserService, TrainerCascadeService } from "@/services/api";
import { useAppStore } from "@/admin/store/useAppStore";

const KpiCard = ({ icon: Icon, label, value, bg, color, description }) => (
  <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-[13px] font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
          {label}
        </p>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white mt-1.5 tracking-tight">
          {value}
        </h3>
      </div>
      <div className={`p-3 rounded-xl ${bg}`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
    </div>
    {description && (
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2.5 flex items-center gap-1 font-medium">
        {description}
      </p>
    )}
  </div>
);

export default function UserManagement() {
  const { addToast } = useAppStore();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteModal, setDeleteModal] = useState(null);
  const [cascadeInfo, setCascadeInfo] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteStep, setDeleteStep] = useState("");

  const fetchUsers = async () => {
    try {
      const data = await UserService.getUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      addToast("Failed to load users", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    let result = users;
    if (roleFilter !== "All") {
      const role = roleFilter === "Trainers" ? "teacher" : "student";
      result = result.filter((u) => u.role === role);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.department?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [users, roleFilter, searchQuery]);

  const trainerCount = users.filter((u) => u.role === "teacher").length;
  const studentCount = users.filter((u) => u.role === "student").length;

  const handleDeleteClick = (user) => {
    setDeleteModal(user);
    setCascadeInfo(null);
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal) return;
    const user = deleteModal;
    setDeleting(true);

    try {
      if (user.role === "teacher") {
        setDeleteStep("Deleting batches...");
        await TrainerCascadeService.deleteBatchesByCreator(user.id).catch(() => {});

        setDeleteStep("Deleting allocations...");
        await TrainerCascadeService.deleteAllocationsByTrainer(user.id).catch(() => {});

        setDeleteStep("Deleting assessments & submissions...");
        await TrainerCascadeService.deleteAssessmentsByCreator(user.id).catch(() => {});

        setDeleteStep("Deleting events...");
        await TrainerCascadeService.deleteEventsByCreator(user.id).catch(() => {});
      }

      setDeleteStep("Deleting user...");
      await UserService.deleteUser(user.id);

      addToast(`${user.name} has been deleted successfully`, "success");
      setDeleteModal(null);
      fetchUsers();
    } catch (err) {
      addToast(`Failed to delete ${user.name}: ${err.message}`, "error");
    } finally {
      setDeleting(false);
      setDeleteStep("");
    }
  };

  const getRoleBadge = (role) => {
    if (role === "teacher") {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#6C1D5F]/10 text-[#6C1D5F] dark:bg-[#84117C]/20 dark:text-[#B8AFCF] border border-[#6C1D5F]/20">
          <GraduationCap className="w-3 h-3" />
          Trainer
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#01AC9F]/10 text-[#01AC9F] dark:bg-[#01AC9F]/20 border border-[#01AC9F]/20">
        <Users className="w-3 h-3" />
        Student
      </span>
    );
  };

  const getInitials = (name) => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#6C1D5F] via-[#84117C] to-[#01AC9F] p-6 sm:p-8 text-white shadow-lg">
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-black/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">User Management</h1>
          <p className="mt-2 text-white/95 text-sm sm:text-base font-medium leading-relaxed">
            Manage trainers and students. Deleting a trainer cascade-deletes all their batches,
            assessments, submissions, allocations, and events.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <KpiCard
          icon={Users}
          label="Total Users"
          value={users.length}
          bg="bg-[#6C1D5F]/10 dark:bg-[#84117C]/10"
          color="text-[#6C1D5F] dark:text-[#84117C]"
          description={`${trainerCount} trainers, ${studentCount} students`}
        />
        <KpiCard
          icon={GraduationCap}
          label="Trainers"
          value={trainerCount}
          bg="bg-[#FF6200]/10"
          color="text-[#FF6200]"
          description="Active trainer accounts"
        />
        <KpiCard
          icon={ShieldCheck}
          label="Students"
          value={studentCount}
          bg="bg-[#01AC9F]/10"
          color="text-[#01AC9F]"
          description="Enrolled student accounts"
        />
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] p-4 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex gap-2">
          {["All", "Trainers", "Students"].map((role) => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                roleFilter === role
                  ? "bg-[#6C1D5F] text-white shadow-md"
                  : "bg-gray-100 dark:bg-[#1a1a2e] text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-[#2e2e3e]"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#1a1a2e] border border-gray-200 dark:border-[#2e2e3e] rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#6C1D5F] dark:text-white transition-all"
          />
        </div>
      </div>

      {/* User List */}
      <div className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <Loader2 className="w-8 h-8 text-[#6C1D5F] animate-spin mx-auto" />
            <p className="mt-3 text-sm text-gray-500 font-medium">Loading users...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">No users found</div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#2e2e3e]">
            {filteredUsers.map((user) => (
              <motion.div
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-[#1a1a2e] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-xl bg-[#6C1D5F]/10 text-[#6C1D5F] dark:text-[#84117C] flex items-center justify-center shrink-0 font-bold text-sm overflow-hidden">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt=""
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      getInitials(user.name)
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-gray-900 dark:text-white text-[15px] truncate">
                      {user.name}
                    </p>
                    <p className="text-[12px] text-gray-500 dark:text-gray-400 truncate font-medium">
                      {user.email}
                      {user.department && (
                        <span className="ml-2 text-gray-400">| {user.department}</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  {getRoleBadge(user.role)}
                  <button
                    onClick={() => handleDeleteClick(user)}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all"
                    title={`Delete ${user.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
            onClick={() => !deleting && setDeleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#15151f] rounded-2xl border border-gray-200 dark:border-[#2e2e3e] shadow-2xl w-full max-w-md p-6"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-red-50 dark:bg-red-500/10">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    Delete {deleteModal.role === "teacher" ? "Trainer" : "Student"}
                  </h3>
                </div>
                {!deleting && (
                  <button
                    onClick={() => setDeleteModal(null)}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-[#2e2e3e] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="mb-5">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-[#1a1a2e] rounded-xl mb-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6C1D5F]/10 text-[#6C1D5F] dark:text-[#84117C] flex items-center justify-center font-bold text-sm">
                    {getInitials(deleteModal.name)}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white text-sm">
                      {deleteModal.name}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      {deleteModal.email}
                    </p>
                  </div>
                </div>

                {deleteModal.role === "teacher" && (
                  <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl p-3">
                    <p className="text-xs font-bold text-red-700 dark:text-red-400 mb-2">
                      This will also permanently delete:
                    </p>
                    <div className="space-y-1.5">
                      {[
                        { icon: BookOpen, text: "All batches created by this trainer" },
                        { icon: Layers, text: "All trainer allocations" },
                        { icon: ClipboardCheck, text: "All assessments & submissions" },
                        { icon: CalendarDays, text: "All events created by this trainer" },
                      ].map(({ icon: Ico, text }) => (
                        <div key={text} className="flex items-center gap-2 text-[12px] text-red-600 dark:text-red-400 font-medium">
                          <Ico className="w-3.5 h-3.5 shrink-0" />
                          {text}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {deleteModal.role === "student" && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This will remove the student account. Any submissions or enrollments will remain
                    as historical records.
                  </p>
                )}
              </div>

              {deleting && (
                <div className="mb-4 flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl">
                  <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-400">
                    {deleteStep}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteModal(null)}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-[#1a1a2e] hover:bg-gray-200 dark:hover:bg-[#2e2e3e] transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={deleting}
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm font-bold text-white bg-red-500 hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
