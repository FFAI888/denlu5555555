import React from "react";
import BottomNav from "../components/BottomNav";

function Profile({ walletAddress, logout }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>我的页面</h1>

      {walletAddress ? (
        <div>
          <p>当前钱包地址：</p>
          <p style={{ wordBreak: "break-all", color: "blue" }}>
            {walletAddress}
          </p>
        </div>
      ) : (
        <p>未连接钱包</p>
      )}

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        退出登录
      </button>

      <BottomNav />
    </div>
  );
}

export default Profile;
