import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  // 定义导航按钮
  const navItems = [
    { path: "/home", label: "首页", icon: "🏠" },
    { path: "/group", label: "拼团", icon: "🤝" },
    { path: "/earn", label: "赚币", icon: "💰" },
    { path: "/swap", label: "兑换", icon: "🔄" },
    { path: "/profile", label: "我的", icon: "👤" },
  ];

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-around",
        borderTop: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
        padding: "10px 0",
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              background: "none",
              border: "none",
              fontSize: "16px",
              cursor: "pointer",
              color: isActive ? "blue" : "black",
              fontWeight: isActive ? "bold" : "normal",
            }}
          >
            <div>{item.icon}</div>
            <div>{item.label}</div>
          </button>
        );
      })}
    </div>
  );
}

export default BottomNav;
