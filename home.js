window.addEventListener('load', function() {
  const walletAddress = localStorage.getItem('walletAddress');
  const inviterAddress = localStorage.getItem('inviterAddress');
  if (!walletAddress || !inviterAddress) {
    alert('请先从登录页面连接钱包并绑定邀请人地址');
    window.location.href = 'login.html';
  }
});

document.getElementById('home-btn').addEventListener('click', function() { alert('你已经在首页'); });
document.getElementById('group-buy-btn').addEventListener('click', function() { alert('拼团页面'); });
document.getElementById('earn-coin-btn').addEventListener('click', function() { alert('赚币页面'); });
document.getElementById('exchange-btn').addEventListener('click', function() { alert('兑换页面'); });
document.getElementById('my-btn').addEventListener('click', function() { alert('我的页面'); });
