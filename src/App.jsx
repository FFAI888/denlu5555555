import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Confirm from "./pages/Confirm";
import Home from "./pages/Home";
import Group from "./pages/Group";
import Earn from "./pages/Earn";
import Swap from "./pages/Swap";
import Profile from "./pages/Profile";

function App() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [inviter, setInviter] = useState("");
  const navigate = useNavigate();

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletConnected(true);
        setWalletAddress(accounts[0]);

        if (inviter) {
          navigate("/home");
        } else {
          navigate("/confirm");
        }
      } catch (error) {
        console.error("用户拒绝连接钱包:", error);
      }
    } else {
      alert("请安装 MetaMask 钱包插件！");
    }
  };

  const confirmRelation = () => {
    setConfirmed(true);
    navigate("/home");
  };

  const logout = () => {
    setWalletConnected(false);
    setWalletAddress(null);
    setConfirmed(false);
    setInviter("");
    navigate("/");
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Login
            connectWallet={connectWallet}
            inviter={inviter}
            setInviter={setInviter}
          />
        }
      />
      <Route
        path="/confirm"
        element={<Confirm confirmRelation={confirmRelation} />}
      />
      <Route
        path="/home"
        element={<Home walletAddress={walletAddress} />}
      />
      <Route path="/group" element={<Group />} />
      <Route path="/earn" element={<Earn />} />
      <Route path="/swap" element={<Swap />} />
      <Route
        path="/profile"
        element={<Profile walletAddress={walletAddress} logout={logout} />}
      />
    </Routes>
  );
}

export default App;
