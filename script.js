// script.js - v0.37

window.onload = function() {
  const connectButton = document.getElementById("connectButton");
  const inviterInput = document.getElementById("inviterInput");
  const statusText = document.getElementById("status");

  // 检查是否已存储邀请人地址
  const storedInviterAddress = localStorage.getItem("inviterAddress");
  if (storedInviterAddress) {
    inviterInput.value = storedInviterAddress;
  }

  // 连接钱包按钮事件
  connectButton.addEventListener("click", function() {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);

      // 检查当前网络是否为BSC网络
      web3.eth.getChainId().then((chainId) => {
        const BSC_CHAIN_ID = 56;  // BSC Mainnet Chain ID
        if (chainId === BSC_CHAIN_ID) {
          // 如果是BSC网络，继续进行钱包连接
          window.ethereum.request({ method: "eth_requestAccounts" })
            .then((accounts) => {
              const walletAddress = accounts[0];
              statusText.textContent = `钱包地址: ${walletAddress}`;

              // 保存钱包地址到本地存储，作为登录标识
              localStorage.setItem("walletAddress", walletAddress);

              // 如果有邀请人地址，则绑定
              if (!storedInviterAddress) {
                const inviterAddress = prompt("请输入邀请人钱包地址:");
                if (inviterAddress) {
                  localStorage.setItem("inviterAddress", inviterAddress);
                  inviterInput.value = inviterAddress;
                  alert("邀请人绑定成功！");
                }
              }

              // 执行跳转到主页
              window.location.href = "home.html";  // 跳转到主页页面
            })
            .catch((err) => {
              alert("钱包连接失败，请重试！");
            });
        } else {
          alert("请切换到BSC网络！");
        }
      });
    } else {
      alert("请安装 MetaMask 或其他支持的钱包插件！");
    }
  });
};
