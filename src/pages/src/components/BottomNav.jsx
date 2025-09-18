import React from "react";
import { useNavigate } from "react-router-dom";

function BottomNav() {
  const navigate = useNavigate();

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
      <button onClick={() => navigate("/home")}>首页</button>
      <button onClick={() => navigate("/group")}>拼团</button>
      <button onClick={() => navigate("/earn")}>赚币</button>
      <button onClick={() => navigate("/swap")}>兑换</button>
      <button onClick={() => navigate("/profile")}>我的</button>
    </div>
  );
}

export default BottomNav;
