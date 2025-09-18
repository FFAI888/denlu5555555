let inviterAddress = localStorage.getItem("inviterAddress") || ""; // 永久存储邀请人地址

function formatAddress(address) {
  if (!address) return "";
  return address.slice(0, 6) + "..." + address.slice(-4);
}

// 彩色滑动提示框
function showToast(message, type = "info") {
  const container = document.getElementById("toastContainer");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);

  // 3秒后淡出并移除
  setTimeout(() => {
    toast.style.animation = "slideOut 0.5s forwards";
    toast.addEventListener("animationend", () => {
      toast.remove();
    });
  }, 3000);
}

// 登录页面钱包连接逻辑
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    showToast("请安装MetaMask!", "error");
    return;
  }

  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const web3 = new Web3(window.ethereum);
    const account = accounts[0];

    // 检查是否是BSC链
    const chainId = await ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x38") {
      showToast("请切换到BSC主网!", "error");
      return;
    }

    document.getElementById("status").innerText = "连接成功: " + formatAddress(account);
    showToast("钱包连接成功", "success");

    // 检测是否有邀请人地址
    if (inviterAddress) {
      document.getElementById("inviterInput").value = inviterAddress;
      showToast("已检测到邀请人地址，直接跳转主页", "warning");
      setTimeout(() => {
        window.location.href = "home.html";
      }, 1000);
    } else {
      // 没有邀请人地址 → 去确认关系页面
      setTimeout(() => {
        window.location.href = "confirm.html";
      }, 500);
    }

  } catch (error) {
    showToast("连接失败: " + error.message, "error");
  }
}

// 安全防护提示（断网、切换钱包、切换网络）
function setupSafetyCheck() {
  if (typeof window.ethereum === "undefined") return;

  ethereum.on("accountsChanged", () => {
    showToast("账户已切换，请重新登录！", "warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
  });

  ethereum.on("chainChanged", () => {
    showToast("网络已切换，请重新登录！", "warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
  });

  window.addEventListener("offline", () => {
    showToast("网络断开，请重新登录！", "warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(() => { window.location.href = "index.html"; }, 1000);
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectButton");
  if (connectButton) {
    document.getElementById("inviterInput").value = inviterAddress;
    connectButton.addEventListener("click", connectWallet);
  }

  setupSafetyCheck();
});
