/* app.js - v1.01
   说明：这是页面的主要逻辑。
   功能：
   - 检测 window.ethereum（MetaMask 等浏览器钱包）
   - 发起连接请求并获取账户
   - 检测当前链（chainId），并确保是 BSC 主网 (0x38 / 56)
   - 若不是 BSC 主网，尝试主动切换；若钱包不包含该链，则提示并尝试添加
*/

const connectBtn = document.getElementById('connectBtn');
const disconnectBtn = document.getElementById('disconnectBtn');
const statusEl = document.getElementById('status');
const addressEl = document.getElementById('address');
const networkEl = document.getElementById('network');
const noticeEl = document.getElementById('notice');

const BSC_CHAIN_ID_HEX = '0x38'; // 56 decimal
const BSC_CHAIN_ID_DEC = 56;

const BSC_PARAMS = {
  chainId: BSC_CHAIN_ID_HEX,
  chainName: 'Binance Smart Chain Mainnet',
  nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
  rpcUrls: ['https://bsc-dataseed.binance.org/'],
  blockExplorerUrls: ['https://bscscan.com/']
};

let provider = null;
let signer = null;
let currentAccount = null;

function showNotice(msg, show = true) {
  noticeEl.style.display = show ? 'block' : 'none';
  noticeEl.textContent = msg || '';
}

function shortAddr(addr) {
  if(!addr) return '—';
  return addr.slice(0,6) + '…' + addr.slice(-4);
}

async function connectWallet() {
  showNotice('');
  if (!window.ethereum) {
    statusEl.textContent = '状态：未检测到浏览器钱包';
    showNotice('未检测到 MetaMask 或兼容钱包，请安装或使用支持的浏览器钱包。');
    return;
  }

  try {
    provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    // 请求连接账户
    const accounts = await provider.send('eth_requestAccounts', []);
    currentAccount = accounts[0];
    signer = provider.getSigner();

    // 读取链ID
    const chainId = await provider.send('eth_chainId', []);
    await handleChain(chainId);

    // 监听变更
    window.ethereum.on('chainChanged', onChainChanged);
    window.ethereum.on('accountsChanged', onAccountsChanged);

    statusEl.textContent = '状态：已连接';
    addressEl.textContent = shortAddr(currentAccount);
    disconnectBtn.disabled = false;
    connectBtn.disabled = true;
  } catch (err) {
    console.error('connect error', err);
    statusEl.textContent = '状态：连接失败';
    showNotice('连接钱包失败：' + (err.message || err));
  }
}

async function handleChain(chainIdHex) {
  const cid = chainIdHex;
  networkEl.textContent = cid + ' (hex)';
  if (cid !== BSC_CHAIN_ID_HEX) {
    statusEl.textContent = '状态：检测到非 BSC 网络，尝试切换……';
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: BSC_CHAIN_ID_HEX }]
      });
      // 切换成功
      statusEl.textContent = '状态：已切换到 BSC';
      networkEl.textContent = `${BSC_CHAIN_ID_HEX} (BSC)`;
      showNotice('');
    } catch (switchError) {
      // 4902 - 未找到链，需要添加
      if (switchError && switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [BSC_PARAMS]
          });
          statusEl.textContent = '状态：已添加并切换到 BSC';
          networkEl.textContent = `${BSC_CHAIN_ID_HEX} (BSC)`;
          showNotice('');
        } catch (addError) {
          console.error('add chain error', addError);
          showNotice('钱包不支持自动添加 BSC：' + (addError.message || addError));
        }
      } else {
        console.error('switch chain error', switchError);
        showNotice('无法切换到 BSC：' + (switchError.message || switchError));
      }
    }
  } else {
    // 已在 BSC
    statusEl.textContent = '状态：已连接至 BSC（支持）';
    networkEl.textContent = `${BSC_CHAIN_ID_HEX} (BSC)`;
  }
}

function onChainChanged(chainIdHex) {
  // 页面接收到链变化事件，刷新显示并强制检查
  (async () => {
    await handleChain(chainIdHex);
  })();
}

function onAccountsChanged(accounts) {
  if (!accounts || accounts.length === 0) {
    // 钱包断开或锁定
    resetUI();
    showNotice('账户已断开或钱包被锁定。');
  } else {
    currentAccount = accounts[0];
    addressEl.textContent = shortAddr(currentAccount);
  }
}

function resetUI() {
  statusEl.textContent = '状态：未连接';
  addressEl.textContent = '—';
  networkEl.textContent = '—';
  connectBtn.disabled = false;
  disconnectBtn.disabled = true;
  showNotice('');
  // 移除监听（如果存在）
  try {
    if (window.ethereum && window.ethereum.removeListener) {
      window.ethereum.removeListener('chainChanged', onChainChanged);
      window.ethereum.removeListener('accountsChanged', onAccountsChanged);
    }
  } catch (e) {
    // 忽略
  }
}

async function disconnectWallet() {
  // 浏览器钱包通常不支持程序断开（MetaMask 不支持），我们通过重置 UI 来“断开”
  resetUI();
  showNotice('已断开（客户端模拟断开，钱包本身仍可能保持已连接状态）。');
}

connectBtn.addEventListener('click', connectWallet);
disconnectBtn.addEventListener('click', disconnectWallet);

// 页面加载时：如果钱包已注入，尝试读取当前状态（不自动弹窗请求）
window.addEventListener('load', async () => {
  if (window.ethereum) {
    provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
    try {
      const accounts = await provider.listAccounts();
      if (accounts && accounts.length > 0) {
        // 有已连接账户（例如用户已提前连接）
        currentAccount = accounts[0];
        signer = provider.getSigner();
        const chainId = await provider.send('eth_chainId', []);
        await handleChain(chainId);
        addressEl.textContent = shortAddr(currentAccount);
        statusEl.textContent = '状态：已预连接';
        connectBtn.disabled = true;
        disconnectBtn.disabled = false;
      }
    } catch (e) {
      console.debug('无需处理：', e);
    }
  }
});
