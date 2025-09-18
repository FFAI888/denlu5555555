// script.js - v0.36

window.onload = function() {
  const connectButton = document.getElementById("connectButton");
  const inviterInput = document.getElementById("inviterInput");
  const statusText = document.getElementById("status");

  // 检查是否已存储邀请人地址
  const storedInviterAddress = localStorage.getItem("inviterAddress");
  if (storedInviterAddress) {
    inviterInput.value = storedInviterAddress;
  }

  // 连接钱包
  connectButton.addEventListener("click", function() {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
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
        })
        .catch((err) => {
          alert("钱包连接失败，请重试！");
        });
    } else {
      alert("请安装 MetaMask 或其他支持的钱包插件！");
    }
  });
};
