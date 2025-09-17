// 引入 ethers.js 库
const { ethers } = require("ethers");

document.getElementById('connectButton').addEventListener('click', async () => {
    // 检查是否有钱包连接（如MetaMask）
    if (window.ethereum) {
        try {
            // 请求连接钱包
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            
            // 获取钱包地址
            const walletAddress = await signer.getAddress();
            console.log("钱包地址：", walletAddress);

            // 设置邀请人地址（假设从 URL 参数中获取）
            const urlParams = new URLSearchParams(window.location.search);
            const inviterAddress = urlParams.get('inviter') || '没有邀请人地址';
            document.getElementById('inviterAddress').value = inviterAddress;

        } catch (error) {
            console.error("连接钱包失败：", error);
        }
    } else {
        alert("请安装 MetaMask 或其他支持的以太坊钱包！");
    }
});
