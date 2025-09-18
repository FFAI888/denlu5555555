let inviterAddress = localStorage.getItem("inviterAddress") || ""; // 永久存储邀请人地址

// 格式化钱包地址（隐藏部分）
function formatAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// 显示提示（仅登录页面使用）
function showToast(message) {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerText = message;
  container.appendChild(toast);

  // 3秒后消失
  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// 连接按钮逻辑
async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    try {
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      const web3 = new Web3(window.ethereum);

      // 检查是否是BSC链
      const chainId = await ethereum.request({ method: "eth_chainId" });
      if (chainId !== "0x38") {
        showToast("请切换到BSC主网!");
        return;
      }

      const account = accounts[0];
      document.getElementById("status").innerText = "连接成功: " + formatAddress(account);
      showToast("钱包连接成功");

      // 判断是否已有绑定邀请人地址
      if (inviterAddress) {
        document.getElementById("inviterInput").value = inviterAddress;
        showToast("检测到已绑定的邀请人地址");
        window.location.href = "home.html";
      } else {
        window.location.href = "confirm.html";
      }

    } catch (error) {
      showToast("连接失败: " + error.message);
    }
  } else {
    showToast("请安装MetaMask!");
  }
}

// 确认关系页面逻辑
function setupConfirmPage() {
  const btnReceive = document.getElementById("btnReceive");
  const btnSend = document.getElementById("btnSend");
  const btnBind = document.getElementById("btnBind");

  if (btnReceive && btnSend && btnBind) {
    btnReceive.addEventListener("click", () => {
      alert("接收确认！");
    });

    btnSend.addEventListener("click", () => {
      alert("发送确认！");
    });

    btnBind.addEventListener("click", () => {
      inviterAddress = "0xInviterExampleWalletAddress";
      localStorage.setItem("inviterAddress", inviterAddress);
      alert("绑定成功！邀请人地址: " + inviterAddress);
      window.location.href = "home.html";
    });
  }
}

// 监听登录状态（断网、切换账户、切换网络）
function setupSafetyCheck() {
  if (typeof window.ethereum !== "undefined") {
    ethereum.on("accountsChanged", () => {
      alert("账户已切换，请重新登录！");
      localStorage.removeItem("inviterAddress");
      window.location.href = "index.html";
    });

    ethereum.on("chainChanged", () => {
      alert("网络已切换，请重新登录！");
      localStorage.removeItem("inviterAddress");
      window.location.href = "index.html";
    });

    window.addEventListener("offline", () => {
      alert("网络断开，请重新登录！");
      localStorage.removeItem("inviterAddress");
      window.location.href = "index.html";
    });
  }
}

window.addEventListener("DOMContentLoaded", () => {
  // 登录页逻辑
  const connectButton = document.getElementById("connectButton");
  if (connectButton) {
    document.getElementById("inviterInput").value = inviterAddress;
    connectButton.addEventListener("click", connectWallet);
  }

  // 确认关系页逻辑
  setupConfirmPage();

  // 安全防护
  setupSafetyCheck();
});
