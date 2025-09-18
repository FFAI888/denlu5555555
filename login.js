function showMessage(message, type='success') {
  const box = document.getElementById('message-box');
  const icon = document.getElementById('message-icon');
  const text = document.getElementById('message-text');
  text.textContent = message;
  box.className = '';
  box.classList.add(type);

  // 设置 Material Icons 图标
  if(type==='success') icon.textContent = 'check_circle';
  else if(type==='error') icon.textContent = 'cancel';
  else if(type==='warning') icon.textContent = 'warning';

  box.style.display = 'block';
  setTimeout(() => { box.style.display = 'none'; }, 3000);
}

async function checkWalletAndChain() {
  if (window.ethereum) {
    try {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      const chainId = await ethereum.request({ method: 'eth_chainId' });

      if (accounts.length === 0) {
        showMessage('请先连接钱包', 'warning');
        return false;
      } else if (chainId !== '0x38') {
        showMessage('请切换到 BSC 网络', 'error');
        return false;
      } else {
        document.getElementById('wallet-status').textContent = `钱包地址: ${accounts[0]}`;
        localStorage.setItem('walletAddress', accounts[0]);
        const inviterAddress = localStorage.getItem('inviterAddress');
        if (inviterAddress) {
          document.getElementById('inviter-address').value = inviterAddress;
          showMessage('已识别邀请人地址，准备进入主页', 'success');
          return true;
        } else {
          window.location.href = 'confirm_inviter.html';
          return false;
        }
      }
    } catch (err) {
      console.error(err);
      showMessage('连接钱包失败，请重试', 'error');
      return false;
    }
  } else {
    alert('请安装 MetaMask 或其他钱包插件');
    return false;
  }
}

document.getElementById('connect-wallet-btn').addEventListener('click', async function() {
  const result = await checkWalletAndChain();
  if (result) window.location.href = 'home.html';
});

if (window.ethereum) {
  window.ethereum.on('accountsChanged', () => window.location.href = 'login.html');
  window.ethereum.on('chainChanged', () => window.location.href = 'login.html');
}
