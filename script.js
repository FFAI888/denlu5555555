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

// 登录钱包逻辑优化 v0.20
async function connectWallet(){
  if(typeof window.ethereum==="undefined"){ showToast("请安装MetaMask!","error"); return;}
  try{
    const accounts=await ethereum.request({method:"eth_requestAccounts"});
    const account=accounts[0];

    const chainId=await ethereum.request({method:"eth_chainId"});
    if(chainId!=="0x38"){ showToast("请切换到BSC主网!","error"); return;}

    document.getElementById("status").innerText="连接成功: "+formatAddress(account);
    showToast("钱包连接成功","success");

    const inviterAddress=localStorage.getItem("inviterAddress");
    if(!inviterAddress){
      // 邀请人地址为空 → 进入确认关系页面绑定
      setTimeout(()=>window.location.href="confirm.html",500);
    } else{
      // 已绑定邀请人 → 直接显示登录页面输入框并进入主页
      document.getElementById("inviterInput").value=inviterAddress;
      showToast("已绑定邀请人地址，直接跳转主页","warning");
      setTimeout(()=>window.location.href="home.html",1000);
    }
  }catch(err){ showToast("连接失败: "+err.message,"error"); }
}

// 确认关系页面绑定邀请人逻辑
document.addEventListener("DOMContentLoaded",()=>{
  const inviterInput=document.getElementById("inviterInput");
  const inviterAddress=localStorage.getItem("inviterAddress")||"";
  if(inviterInput && inviterAddress) inviterInput.value=inviterAddress;

  const btnBind=document.getElementById("btnBind");
  if(btnBind){
    btnBind.addEventListener("click",async()=>{
      if(typeof window.ethereum==="undefined"){ showToast("请安装MetaMask!","error"); return;}
      try{
        const accounts=await ethereum.request({method:"eth_requestAccounts"});
        const account=accounts[0];
        // 永久绑定邀请人地址
        localStorage.setItem("inviterAddress",account);
        showToast("绑定成功！返回登录页面显示","success");
        setTimeout(()=>window.location.href="index.html",1000);
      }catch(err){ showToast("绑定失败: "+err.message,"error");}
    });
  }
});
