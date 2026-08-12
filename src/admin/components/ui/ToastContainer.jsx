import React from "react";
import { useAppStore } from "../../store/useAppStore";

export const ToastContainer = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-wrapper">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type}`}>
          {toast.type === "success" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="var(--emerald)"
              strokeWidth="2"
            >
              <path d="M4 10l4 4 8-8" />
            </svg>
          )}
          {toast.type === "error" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="var(--orange)"
              strokeWidth="2"
            >
              <path d="M10 4v8M10 16h.01" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          )}
          {toast.type === "info" && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
            >
              <path d="M10 8v6M10 4h.01" />
              <circle cx="10" cy="10" r="8" />
            </svg>
          )}
          <span style={{ flex: 1 }}>{toast.message}</span>
          <button
            style={{ background: "transparent", border: "none", cursor: "pointer", opacity: 0.5 }}
            onClick={() => removeToast(toast.id)}
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M5 5l10 10M15 5L5 15" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
