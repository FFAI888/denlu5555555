// 确保页面加载时检查是否有以太坊钱包
window.addEventListener('load', function() {
    // 检查是否安装了MetaMask
    if (typeof window.ethereum !== 'undefined') {
        console.log('MetaMask is installed!');
    } else {
        alert('请安装MetaMask或其他以太坊钱包插件');
    }
});

// BSC 网络信息
const bscNetwork = {
    chainId: '0x38', // BSC 网络的 chainId 为 0x38（十六进制）
    chainName: 'Binance Smart Chain',
    rpcUrls: ['https://bsc-dataseed.binance.org/'],
    nativeCurrency: {
        name: 'Binance Coin',
        symbol: 'BNB',
        decimals: 18
    },
    blockExplorerUrls: ['https://bscscan.com']
};

// 连接钱包功能
document.getElementById('connectWalletBtn').addEventListener('click', async () => {
    // 尝试请求用户连接钱包
    try {
        // 请求连接钱包并获取用户账户
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        const userAddress = accounts[0];
        
        // 获取当前网络
        const network = await ethereum.request({ method: 'eth_chainId' });

        // 检查当前网络是否为BSC
        if (network !== bscNetwork.chainId) {
            // 网络不是BSC，要求用户切换到BSC网络
            document.getElementById('networkWarning').innerText = '当前网络不是BSC，请切换到BSC网络';
            
            // 提示用户切换网络
            try {
                await ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: bscNetwork.chainId }],
                });
                // 切换成功后显示钱包地址
                document.getElementById('walletAddress').innerText = `已连接钱包地址: ${userAddress}`;
                console.log(`连接成功，钱包地址是: ${userAddress}`);
            } catch (error) {
                console.error('切换网络失败:', error);
                alert('无法切换到BSC网络，请手动切换');
            }
        } else {
            // 如果是BSC链，显示钱包地址
            document.getElementById('walletAddress').innerText = `已连接钱包地址: ${userAddress}`;
            console.log(`连接成功，钱包地址是: ${userAddress}`);
        }

    } catch (error) {
        console.error('用户拒绝连接钱包或出现错误:', error);
        alert('连接钱包失败，请重试');
    }
});
