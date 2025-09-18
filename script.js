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
    0:["首页模块：欢迎回来！","热门功能：xxx","最新公告：RongChain上线啦！"],
    1:["拼团模块：拼团活动火热进行中","参与拼团，享受折扣","拼团规则请查看详情"],
    2:["赚币模块：每日签到奖励","完成任务赚代币","邀请好友赚更多"],
    3:["兑换模块：支持USDT兑换RGC","最低兑换额度10U","实时汇率已更新"],
    4:["我的模块：个人资料","钱包信息","邀请人信息"]
  };
  if(navItems.length && pageContent){
    navItems.forEach((item,idx)=>{
      item.addEventListener("click",()=>{
        navItems.forEach(n=>n.classList.remove("active"));
        item.classList.add("active");
        pageContent.classList.remove("active");
        void pageContent.offsetWidth;
        pageContent.classList.add("fade-in");
        setTimeout(()=>{
          pageContent.innerHTML=dataMap[idx].map(d=>`<p>${d}</p>`).join("");
          pageContent.classList.add("active");
        },150);
      });
    });
  }
});

// 模拟钱包连接
async function connectWallet(){
  if(typeof window.ethereum==="undefined"){ showToast("请安装MetaMask!","error"); return;}
  try{
    const accounts=await ethereum.request({method:"eth_requestAccounts"});
    const account=accounts[0];
    const inviter=localStorage.getItem("inviterAddress")||"";
    if(!inviter){ window.location.href="confirm.html"; }
    else{ window.location.href="home.html"; }
  }catch(err){ showToast("连接失败: "+err.message,"error"); }
}

// 安全检查
function setupSafetyCheck(){
  if(typeof window.ethereum!=="undefined"){
    ethereum.on("accountsChanged",()=>{ localStorage.removeItem("inviterAddress"); window.location.href="index.html"; });
    ethereum.on("chainChanged",()=>{ localStorage.removeItem("inviterAddress"); window.location.href="index.html"; });
    window.addEventListener("offline",()=>{ showToast("网络已断开,请重新登录","warning"); window.location.href="index.html"; });
  }
}

// 提示框
function showToast(msg,type="success"){
  const c=document.getElementById("toastContainer");
  const t=document.createElement("div");
  t.className="toast "+type;
  t.innerText=msg;
  c.appendChild(t);
  setTimeout(()=>{ t.style.animation="slideOut 0.5s forwards"; },2500);
  setTimeout(()=>{ t.remove(); },3000);
}
