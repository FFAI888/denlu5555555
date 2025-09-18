function formatAddress(address){
  if(!address) return "";
  return address.slice(0,6)+"..."+address.slice(-4);
}

function showToast(message,type="info"){
  const container=document.getElementById("toastContainer");
  if(!container) return;
  const toast=document.createElement("div");
  toast.className=`toast ${type}`;
  toast.innerText=message;
  container.appendChild(toast);
  setTimeout(()=>{
    toast.style.animation="slideOut 0.5s forwards";
    toast.addEventListener("animationend",()=>toast.remove());
  },3000);
}

// 登录钱包逻辑优化 v0.22
async function connectWallet(){
  if(typeof window.ethereum==="undefined"){ showToast("请安装MetaMask!","error"); return;}
  try{
    const accounts=await ethereum.request({method:"eth_requestAccounts"});
    const walletAccount=accounts[0];

    const chainId=await ethereum.request({method:"eth_chainId"});
    if(chainId!=="0x38"){ showToast("请切换到BSC主网!","error"); return;}

    document.getElementById("status").innerText="钱包连接成功: "+formatAddress(walletAccount);
    showToast("钱包连接成功","success");

    const inviterAddress=localStorage.getItem("inviterAddress");
    if(!inviterAddress){
      setTimeout(()=>window.location.href="confirm.html",500);
    } else{
      const inviterInput=document.getElementById("inviterInput");
      if(inviterInput) inviterInput.value=inviterAddress; // 只显示已绑定邀请人地址
      showToast("已绑定邀请人地址，直接跳转主页","warning");
      setTimeout(()=>window.location.href="home.html",1000);
    }
  }catch(err){ showToast("连接失败: "+err.message,"error"); }
}

// 实时监控 - App式保护
function setupSafetyCheck(){
  if(typeof window.ethereum==="undefined") return;
  ethereum.on("accountsChanged",()=>{
    showToast("账户已切换，请重新登录！","warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(()=>window.location.href="index.html",1000);
  });
  ethereum.on("chainChanged",()=>{
    showToast("网络已切换，请重新登录！","warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(()=>window.location.href="index.html",1000);
  });
  window.addEventListener("offline",()=>{
    showToast("网络断开，请重新登录！","warning");
    localStorage.removeItem("inviterAddress");
    setTimeout(()=>window.location.href="index.html",1000);
  });
}

document.addEventListener("DOMContentLoaded",()=>{
  const inviterInput=document.getElementById("inviterInput");
  const inviterAddress=localStorage.getItem("inviterAddress")||"";
  if(inviterInput && inviterAddress) inviterInput.value=inviterAddress;

  const connectButton=document.getElementById("connectButton");
  if(connectButton) connectButton.addEventListener("click",connectWallet);

  setupSafetyCheck();

  // 确认关系页面绑定逻辑
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
});
