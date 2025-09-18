import React from "react";
import BottomNav from "../components/BottomNav";

function Group() {
  // 模拟拼团数据
  const groups = [
    { id: 1, title: "拼团活动 A", joined: 3, total: 5 },
    { id: 2, title: "拼团活动 B", joined: 1, total: 4 },
    { id: 3, title: "拼团活动 C", joined: 2, total: 6 },
  ];

  const joinGroup = (title) => {
    alert(`您已加入【${title}】`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "30px" }}>
      <h1>拼团页面</h1>
      <p>这里展示拼团活动，您可以选择加入。</p>

      <div style={{ maxWidth: "400px", margin: "0 auto" }}>
        {groups.map((group) => (
          <div
            key={group.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "15px",
              marginBottom: "15px",
              textAlign: "left",
              backgroundColor: "#fdfdfd",
            }}
          >
            <h3>{group.title}</h3>
            <p>
              已加入人数: {group.joined} / {group.total}
            </p>
            <button
              onClick={() => joinGroup(group.title)}
              style={{
                padding: "8px 16px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              加入拼团
            </button>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

export default Group;
