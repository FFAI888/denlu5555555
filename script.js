// 登录页面
let inviterAddress = localStorage.getItem("inviterAddress") || "";

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

  setTimeout(() => {
    toast.style.animation = "slideOut 0.5s forwards";
    toast.addEventListener("animationend", () => toast.remove());
  }, 3000);
}

// 连接钱包逻辑
async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    showToast("请安装MetaMask!", "error");
    return;
  }
  try {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    const web3 = new Web3(window.ethereum);
    const account = accounts[0];

    const chainId = await ethereum.request({ method: "eth_chainId" });
    if (chainId !== "0x38") {
      showToast("请切换到BSC主网!", "error");
      return;
    }

    document.getElementById("status").innerText = "连接成功: " + formatAddress(account);
    showToast("钱包连接成功", "success");

    if (inviterAddress) {
      document.getElementById("inviterInput").value = inviterAddress;
      showToast("已检测到邀请人地址，直接跳转主页", "warning");
      setTimeout(() => window.location.href = "home.html", 1000);
    } else {
      setTimeout(() => window.location.href = "confirm.html", 500);
    }
  } catch (error) {
    showToast("连接失败: " + error.message, "error");
  }
}

// 安全防护
function setupSafetyCheck() {
  if (typeof window.ethereum === "undefined") return;

  ethereum.on("accountsChanged", () => {
    showToast("账户已切换，请重新登录！", "warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(() => window.location.href = "index.html", 1000);
  });

  ethereum.on("chainChanged", () => {
    showToast("网络已切换，请重新登录！", "warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(() => window.location.href = "index.html", 1000);
  });

  window.addEventListener("offline", () => {
    showToast("网络断开，请重新登录！", "warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(() => window.location.href = "index.html", 1000);
  });
}

// 导航栏高亮 + 切换页面内容
window.addEventListener("DOMContentLoaded", () => {
  const connectButton = document.getElementById("connectButton");
  if (connectButton) {
    document.getElementById("inviterInput").value = inviterAddress;
    connectButton.addEventListener("click", connectWallet);
  }

  setupSafetyCheck();

  const navItems = document.querySelectorAll(".nav-item");
  const pageContent = document.getElementById("pageContent");
  const contentArray = [
    "首页内容区域",
    "拼团内容区域",
    "赚币内容区域",
    "兑换内容区域",
    "我的内容区域"
  ];

  navItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      navItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
      if(pageContent) pageContent.innerHTML = `<p>${contentArray[index]}</p>`;
    });
  });
});
