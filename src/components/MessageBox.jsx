import React from 'react';

function MessageBox({ children, type = "info", className = "" }) {
  const colors = {
    info:    { bg: "#dfe9ff", color: "#2c3e50", icon: "ℹ️" },
    success: { bg: "#e8f6f3", color: "#1e8449", icon: "✅" },
    error:   { bg: "#f8d7da", color: "#b71c1c", icon: "❌" },
    warning: { bg: "#fff3cd", color: "#856404", icon: "⚠️" }
  };

  const style = colors[type] || colors.info;

  return (
    <div
      className={`message-box ${className}`}
      style={{
        background: style.bg,
        color: style.color,
        padding: "16px 20px",
        borderRadius: "12px",
        marginBottom: "20px",
        fontWeight: "500",
        textAlign: "left",
        border: `1px solid ${style.color}20`,
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        fontSize: "15px",
        lineHeight: "1.5"
      }}
    >
      <span style={{ fontSize: "18px", flexShrink: 0 }}>
        {style.icon}
      </span>
      <div style={{ flex: 1 }}>
        {children}
      </div>
    </div>
  );
}

export default MessageBox;