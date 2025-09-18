import React, { useState, useEffect } from "react";
import BottomNav from "../components/BottomNav";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Home({ walletAddress }) {
  const banners = [
    "🎉 活动 1：拼团优惠",
    "💎 活动 2：每日任务奖励",
    "⚡ 活动 3：限时兑换活动",
  ];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? banners.length - 1 : prevIndex - 1
    );
  };
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % banners.length);
  };

  const shortWallet = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : "";

  const defaultModules = [
    {
      id: "recommendations",
      title: "推荐卡片",
      show: true,
      content: [
        { id: 1, title: "今日拼团推荐", description: "参与拼团，享受折扣！" },
        { id: 2, title: "每日任务提示", description: "完成任务可赚币哦！" },
        { id: 3, title: "限时优惠活动", description: "兑换币享受额外奖励！" },
      ],
      handleClick: (item) => alert(`您已查看：${item.title}`),
    },
    {
      id: "hotGroups",
      title: "热门拼团",
      show: true,
      content: [
        { id: 1, title: "拼团活动 A", joined: 3, total: 5 },
        { id: 2, title: "拼团活动 B", joined: 1, total: 4 },
      ],
      handleClick: (item) => alert(`您已加入【${item.title}】`),
    },
    {
      id: "tasks",
      title: "今日赚币任务",
      show: true,
      content: [
        { id: 1, title: "每日签到", reward: 10 },
        { id: 2, title: "邀请好友", reward: 20 },
      ],
      handleClick: (item) =>
        alert(`任务【${item.title}】已完成，获得 ${item.reward} 币`),
    },
  ];

  // 初始化从 localStorage 获取数据
  const [modules, setModules] = useState(() => {
    const saved = localStorage.getItem("homeModules");
    return saved ? JSON.parse(saved) : defaultModules;
  });

  // 保存到 localStorage
  const saveModules = (modulesData) => {
    localStorage.setItem("homeModules", JSON.stringify(modulesData));
  };

  const toggleModule = (id) => {
    const updated = modules.map((m) =>
      m.id === id ? { ...m, show: !m.show } : m
    );
    setModules(updated);
    saveModules(updated);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(modules);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    setModules(items);
    saveModules(items);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "20px" }}>
      <h1>首页</h1>
      {walletAddress ? (
        <p style={{ fontWeight: "bold" }}>欢迎，{shortWallet} 用户</p>
      ) : (
        <p>欢迎来到 DApp 应用</p>
      )}

      {/* 轮播图 */}
      <div
        style={{
          maxWidth: "400px",
          margin: "20px auto",
          padding: "10px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          backgroundColor: "#fdfdfd",
          position: "relative",
        }}
      >
        <button
          onClick={handlePrev}
          style={{
            position: "absolute",
            left: "5px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ◀
        </button>
        <div style={{ padding: "20px", fontSize: "16px" }}>
          {banners[currentIndex]}
        </div>
        <button
          onClick={handleNext}
          style={{
            position: "absolute",
            right: "5px",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            fontSize: "18px",
            cursor: "pointer",
          }}
        >
          ▶
        </button>
      </div>

      {/* 模块拖拽 */}
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="modules">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {modules.map((module, index) => (
                <Draggable key={module.id} draggableId={module.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        maxWidth: "400px",
                        margin: "20px auto",
                        border: "1px solid #ccc",
                        borderRadius: "8px",
                        backgroundColor: "#fdfdfd",
                        transition: "all 0.3s ease",
                      }}
                    >
                      <div
                        {...provided.dragHandleProps}
                        onClick={() => toggleModule(module.id)}
                        style={{
                          padding: "10px",
                          fontWeight: "bold",
                          cursor: "pointer",
                          backgroundColor: "#eee",
                        }}
                      >
                        {module.title} {module.show ? "▲" : "▼"} (拖拽此处)
                      </div>
                      <div
                        style={{
                          maxHeight: module.show ? "1000px" : "0",
                          overflow: "hidden",
                          transition: "max-height 0.5s ease",
                        }}
                      >
                        {module.show &&
                          module.content.map((item) => (
                            <div
                              key={item.id}
                              style={{
                                padding: "15px",
                                borderBottom: "1px solid #ccc",
                                textAlign: "left",
                              }}
                            >
                              {module.id === "recommendations" && (
                                <>
                                  <h3>{item.title}</h3>
                                  <p>{item.description}</p>
                                </>
                              )}
                              {module.id === "hotGroups" && (
                                <>
                                  <h3>{item.title}</h3>
                                  <p>
                                    已加入人数: {item.joined} / {item.total}
                                  </p>
                                </>
                              )}
                              {module.id === "tasks" && (
                                <>
                                  <h3>{item.title}</h3>
                                  <p>奖励: {item.reward} 币</p>
                                </>
                              )}
                              <button
                                onClick={() => module.handleClick(item)}
                                style={{
                                  padding: "8px 16px",
                                  backgroundColor:
                                    module.id === "hotGroups"
                                      ? "green"
                                      : module.id === "tasks"
                                      ? "blue"
                                      : "teal",
                                  color: "white",
                                  border: "none",
                                  borderRadius: "5px",
                                  cursor: "pointer",
                                }}
                              >
                                {module.id === "hotGroups"
                                  ? "加入拼团"
                                  : module.id === "tasks"
                                  ? "完成任务"
                                  : "查看"}
                              </button>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <BottomNav />
    </div>
  );
}

export default Home;
