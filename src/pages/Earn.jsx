import React from "react";
import BottomNav from "../components/BottomNav";

function Earn() {
  // 模拟任务列表数据
  const tasks = [
    { id: 1, title: "每日签到", reward: 10 },
    { id: 2, title: "邀请好友", reward: 20 },
    { id: 3, title: "完成首次交易", reward: 50 },
  ];

  const completeTask = (task) => {
    alert(`任务【${task.title}】已完成，获得 ${task.reward} 币`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>赚币页面</h1>
      <p>完成任务即可获得奖励币。</p>

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {tasks.map((task) => (
          <div
            key={task.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              textAlign: "left",
              backgroundColor: "#fdfdfd",
            }}
          >
            <h3>{task.title}</h3>
            <p>奖励: {task.reward} 币</p>
            <button
              onClick={() => completeTask(task)}
              style={{
                padding: "8px 16px",
                backgroundColor: "blue",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              完成任务
            </button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default Earn;
