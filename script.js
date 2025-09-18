// script.js - v0.28
// v0.28 - 登录、邀请人绑定、主页动态模块加载 + 模拟接口数据 + 动画 + 显示版本号
document.addEventListener("DOMContentLoaded",()=>{
  const VERSION = "v0.28";

  // 页面同步显示版本号
  document.querySelectorAll('.version-display').forEach(el=>{
    el.textContent = VERSION;
  });

  // 登录按钮绑定
  const connectButton=document.getElementById("connectButton");
  if(connectButton){
    connectButton.style.opacity="1";
    connectButton.style.pointerEvents="auto";
    connectButton.addEventListener("click", connectWallet);
  }

  // 邀请人绑定逻辑
  const inviterInput=document.getElementById("inviterInput");
  const inviterAddress=localStorage.getItem("inviterAddress")||"";
  if(inviterInput && inviterAddress) inviterInput.value=inviterAddress;

  setupSafetyCheck();

  const btnBind=document.getElementById("btnBind");
  if(btnBind){
    btnBind.addEventListener("click",async()=>{
      if(typeof window.ethereum==="undefined"){ showToast("请安装MetaMask!","error"); return;}
      try{
        const accounts=await ethereum.request({method:"eth_requestAccounts"});
        const walletAccount=accounts[0];
        const userInviterAddress=prompt("请输入邀请人钱包地址进行绑定:");
        if(!userInviterAddress || userInviterAddress===walletAccount){
          showToast("邀请人地址无效或不能是自己的钱包地址","error");
          return;
        }
        localStorage.setItem("inviterAddress",userInviterAddress);
        showToast("绑定成功！返回登录页面显示","success");
        setTimeout(()=>window.location.href="index.html",1000);
      }catch(err){ showToast("绑定失败: "+err.message,"error");}
    });
  }

  // 主页动态模块加载 + 高亮导航 + 模块切换动画 + 模拟接口数据
  const navItems=document.querySelectorAll(".nav-item");
  const pageContent=document.getElementById("pageContent");
  const dataMap={
    0
