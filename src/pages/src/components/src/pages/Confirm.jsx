import React from "react";

function Confirm({ confirmRelation }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>确认关系页面</h1>
      <p>请选择确认操作：</p>
      <div style={{ display: "flex", justifyContent: "center", gap: "15px" }}>
        <button
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "green",
            color: "white",
          }}
          onClick={confirmRelation}
        >
          确认接收
        </button>
        <button
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "blue",
            color: "white",
          }}
          onClick={confirmRelation}
        >
          确认发送
        </button>
        <button
          style={{
            width: "120px",
            height: "40px",
            backgroundColor: "orange",
            color: "white",
          }}
          onClick={confirmRelation}
        >
          确认绑定
        </button>
      </div>
    </div>
  );
}

export default Confirm;
