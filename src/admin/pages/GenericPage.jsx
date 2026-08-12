import React from "react";

export default function GenericPage({ title, subtitle }) {
  return (
    <>
      <div className="page-header">
        <div>
          <div className="page-title">{title}</div>
          {subtitle && <div className="page-subtitle">{subtitle}</div>}
        </div>
      </div>

      <div className="card" style={{ padding: "60px 20px", textAlign: "center" }}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--border)"
          strokeWidth="1.5"
          style={{ margin: "0 auto 16px" }}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="3" y1="9" x2="21" y2="9"></line>
          <line x1="9" y1="21" x2="9" y2="9"></line>
        </svg>
        <div
          style={{ fontSize: "18px", fontWeight: 600, color: "var(--black)", marginBottom: "8px" }}
        >
          Module Under Construction
        </div>
        <div style={{ fontSize: "14px", color: "var(--dark-gray)" }}>
          This module is currently being built and will be available in the next release.
        </div>
      </div>
    </>
  );
}
