import { create } from "zustand";

import { api } from "../services/api";

export const useAppStore = create((set, get) => ({
  isSidebarCollapsed: false,
  activeTenant: "Global · All Tenants",
  activeSidebarItem: "Dashboard",
  breadcrumbs: [],
  toasts: [],
  modals: {
    addOrg: false,
    quickCreate: false,
    addUser: false,
  },

  adminProfile: {
    name: "Admin User",
    email: "admin@xebia.com",
    role: "System Administrator",
    image: null,
  },

  updateAdminProfile: (updates) =>
    set((state) => {
      const newProfile = { ...state.adminProfile, ...updates };
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("lms_admin_profile", JSON.stringify(newProfile));
        } catch (error) {
          console.warn("Could not save profile to localStorage, it might be too large.", error);
        }
      }
      return { adminProfile: newProfile };
    }),

  hydrateProfile: () => {
    if (typeof window === "undefined") return;
    try {
      const saved = localStorage.getItem("lms_admin_profile");
      if (saved) set({ adminProfile: JSON.parse(saved) });
    } catch (e) {}
  },

  dashboardData: null,
  organizations: [],
  users: [],
  approvals: [],
  isLoading: false,
  isLoadingOrgs: false,
  isLoadingUsers: false,

  toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),
  setTenant: (tenant) => set({ activeTenant: tenant }),
  setActiveSidebarItem: (item) => set({ activeSidebarItem: item }),
  setBreadcrumbs: (crumbs) => set({ breadcrumbs: crumbs }),

  addToast: (message, type = "info") => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      get().removeToast(id);
    }, 4000);
  },

  removeToast: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),

  openModal: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: true } })),
  closeModal: (modal) => set((state) => ({ modals: { ...state.modals, [modal]: false } })),

  fetchDashboardData: async () => {
    set({ isLoading: true });
    try {
      const data = await api.dashboard.getOverview();
      set({ dashboardData: data, isLoading: false, approvals: data.approvals });
    } catch (error) {
      console.error("Failed to load dashboard data", error);
      get().addToast("Failed to load dashboard data", "error");
      set({ isLoading: false });
    }
  },

  fetchOrganizations: async () => {
    set({ isLoadingOrgs: true });
    try {
      const orgs = await api.organizations.list();
      set({ organizations: orgs, isLoadingOrgs: false });
    } catch (error) {
      get().addToast("Failed to load organizations", "error");
      set({ isLoadingOrgs: false });
    }
  },

  fetchUsers: async () => {
    set({ isLoadingUsers: true });
    try {
      const users = await api.users.list();
      set({ users, isLoadingUsers: false });
    } catch (error) {
      get().addToast("Failed to load users", "error");
      set({ isLoadingUsers: false });
    }
  },

  processApproval: async (id, action) => {
    try {
      await api.approvals.process(id, action);
      set((state) => ({
        approvals: state.approvals.filter((a) => a.id !== id),
      }));
      get().addToast(`Request ${action}d successfully.`, "success");
      // Update dashboard KPI optimistically
      set((state) => {
        if (state.dashboardData) {
          return {
            dashboardData: {
              ...state.dashboardData,
              kpi: {
                ...state.dashboardData.kpi,
                approvals: {
                  ...state.dashboardData.kpi.approvals,
                  total: Math.max(0, state.dashboardData.kpi.approvals.total - 1),
                },
              },
            },
          };
        }
        return state;
      });
    } catch (error) {
      get().addToast(`Failed to ${action} request.`, "error");
    }
  },

  createOrganization: async (org) => {
    try {
      const newOrg = await api.organizations.create(org);
      set((state) => ({
        organizations: [newOrg, ...state.organizations],
      }));
      get().addToast(`Organization ${newOrg.name} created.`, "success");
    } catch (error) {
      get().addToast("Failed to create organization.", "error");
    }
  },

  createUser: async (user) => {
    try {
      const newUser = await api.users.create(user);
      set((state) => ({
        users: [newUser, ...state.users],
      }));
      get().addToast(`User ${newUser.name} created.`, "success");
    } catch (error) {
      get().addToast("Failed to create user.", "error");
    }
  },
}));
