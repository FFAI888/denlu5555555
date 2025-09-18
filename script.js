// v0.26 - 主页动态模块加载 + 模拟接口数据 + 动画效果
document.addEventListener("DOMContentLoaded",()=>{
  // 原有登录与绑定逻辑保持 v0.25 完整
  const inviterInput=document.getElementById("inviterInput");
  const inviterAddress=localStorage.getItem("inviterAddress")||"";
  if(inviterInput && inviterAddress) inviterInput.value=inviterAddress;

  const connectButton=document.getElementById("connectButton");
  if(connectButton) connectButton.addEventListener("click",connectWallet);
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

  // ---- 主页导航动态加载功能 + 模块动画 + 模拟接口数据 ----
  const navItems=document.querySelectorAll(".nav-item");
  const pageContent=document.getElementById("pageContent");

  // 模拟接口数据
  const dataMap={
    0: {title:"首页", items:["最新活动1","最新活动2","热门新闻"]},
    1: {title:"拼团", items:["拼团商品A","拼团商品B","拼团商品C"]},
    2: {title:"赚币", items:["赚币任务1","赚币任务2","赚币任务3"]},
    3: {title:"兑换", items:["兑换商品X","兑换商品Y","兑换商品Z"]},
    4: {title:"我的", items:["个人资料","我的邀请","设置"]}
  };

  navItems.forEach((item,index)=>{
    item.addEventListener("click",()=>{
      // 高亮当前按钮
      navItems.forEach(i=>i.classList.remove("active"));
      item.classList.add("active");

      // 模块内容动画切换
      if(pageContent){
        pageContent.classList.remove("active");
        pageContent.classList.add("fade-in");
        pageContent.style.opacity = 0;
        pageContent.style.transform = "translateY(20px)";
        setTimeout(()=>{
          // 动态生成模块内容
          const data=dataMap[index];
          let html=`<h2>${data.title}</h2><ul>`;
          data.items.forEach(it=>html+=`<li>${it}</li>`);
          html+="</ul>";
          pageContent.innerHTML = html;
          pageContent.classList.add("active");
          pageContent.style.opacity = 1;
          pageContent.style.transform = "translateY(0)";
        },50);
      }
    });
  });

  // 默认加载首页内容
  navItems[0].click();
});
