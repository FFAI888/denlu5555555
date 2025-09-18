import React, { useState } from "react";
import BottomNav from "../components/BottomNav";

function Swap() {
  const [amount, setAmount] = useState("");
  const [swapType, setSwapType] = useState("A→B");

  const handleSwap = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      alert("请输入正确的兑换数量！");
      return;
    }
    alert(`兑换成功，已兑换 ${amount} 个币 (${swapType})`);
    setAmount(""); // 兑换完成后清空输入框
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>兑换页面</h1>
      <p>请输入兑换数量并选择兑换类型：</p>

      <div
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "15px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fdfdfd",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label>数量：</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ width: "80%", padding: "5px" }}
          />
        </div>

        <div style={{ marginBottom: "10px" }}>
          <label>兑换类型：</label>
          <select
            value={swapType}
            onChange={(e) => setSwapType(e.target.value)}
            style={{ width: "85%", padding: "5px" }}
          >
            <option value="A→B">币 A → 币 B</option>
            <option value="B→A">币 B → 币 A</option>
          </select>
        </div>

        <button
          onClick={handleSwap}
          style={{
            padding: "8px 16px",
            backgroundColor: "purple",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          兑换
        </button>
      </div>

      <BottomNav />
    </div>
  );
}

export default Swap;
