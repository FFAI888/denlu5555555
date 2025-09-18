import React from "react";

function Login({ connectWallet, inviter }) {
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>登录页面</h1>
      <p>请点击下方按钮连接您的钱包</p>
      <button onClick={connectWallet}>连接 MetaMask 钱包</button>

      <div style={{ marginTop: "20px" }}>
        <label style={{ marginRight: "10px" }}>邀请人</label>
        <input
          type="text"
          value={inviter || ""}
          readOnly
          style={{ width: "250px" }}
        />
      </div>
    </div>
  );
}

export default Login;
