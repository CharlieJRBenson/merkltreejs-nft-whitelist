// CONSTANTS
const supportedChainId = 5;
const EST_GAS = 1000000;
const nftAbi = [{
    "inputs": [
        {
            "internalType": "uint256",
            "name": "_mintAmount",
            "type": "uint256"
        },
        {
            "internalType": "bytes32[]",
            "name": "merkleProof",
            "type": "bytes32[]"
        }
    ],
    "name": "mint",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
},
{
    "inputs": [],
    "name": "mintPrice",
    "outputs": [{
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
    }],
    "stateMutability": "view",
    "type": "function"
},
];

// VARIABLES
let connected = false;
let account;
let nft;

const showError = (errorMessage) => {
    Swal.fire({
        title: 'Error!',
        html: errorMessage,
        icon: 'error',
        showConfirmButton: false,
        timer: 4000,
        timerProgressBar: true,
    })
}

const showSuccess = (successMessage) => {
    Swal.fire({
        title: 'Success!',
        html: successMessage,
        icon: 'success',
    })
}

const showMoonpayModal = () => {
    Swal.fire({
        title: 'Moonpay',
        showConfirmButton: false,
        showCloseButton: true,
        html: `
        <iframe
            class='moonpay-frame'
            src="https://buy.moonpay.com?apiKey=pk_live_iPAKlFahWageWmf0LL4MjAWONzg55u&currencyCode=eth"
            title="MoonPay Frame"
        ></iframe>
        `,
    })
}

const connect = async (shouldShowNetworkErrorAlert = true) => {
    if (typeof web3 !== 'undefined') {
        web3Provider = web3.currentProvider;
        web3 = new Web3(web3.currentProvider);
    } else {
        window.open(`https://metamask.app.link/dapp/${window.location.href.replace(/^https?:\/\//, "")}`);
        return;
    }
    const chainId = await web3.eth.getChainId();
    if (chainId !== supportedChainId) {
        if (shouldShowNetworkErrorAlert) {
            showError("Network is not supported! Please switch to ETH Network");
        }
        return;
    }

    // Modern dapp browsers...
    if (window.ethereum) {
        window.web3 = new Web3(ethereum);
        try {
            // Request account access if needed
            await ethereum.enable();
            // Acccounts now exposed
            await web3.eth.sendTransaction({
                /* ... */
            });
            connected = true
            // alert('Enabled')

        } catch (error) { // User denied account access...
        }
    } // Legacy dapp browsers...
    else if (window.web3) {
        web3Provider = web3.currentProvider;
        window.web3 = new Web3(web3.currentProvider);
        // Acccounts always exposed
        await web3.eth.sendTransaction({
            /* ... */
        });
        connected = true

    } else {
        console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    }
    const accounts = await web3.eth.getAccounts();
    loadAccount(accounts);
    loadToken();
}

const disconnect = () => {
    connectButton.text("CONNECT WALLET");
    account = "";
    connected = false;
    $(".mint-section .mint-content .btn-connect-wallet").show();
    $(".btn-mint").hide();
}

const loadAccount = async (accounts) => {
    if (accounts.length > 0) {
        account = accounts[0];
        connected = true;
        displayedAccount = account.substring(0, 5) + '...' + account.substring(account.length - 4, account.length) + ' ';
        connectButton.text(displayedAccount);
        $(".btn-mint").show();
        $(".mint-section .mint-content .btn-connect-wallet").hide();
    }
}

const loadToken = async () => {
    nft = new web3.eth.Contract(nftAbi, nftAddress);
}

const mint = async () => {
    if (!account) {
        await connect();
    }
    const numberOfTokens = $('#mint-input').val();


    if (nft === undefined || !account || !numberOfTokens) {
        return;
    }
    let nftPrice = await nft.methods.mintPrice().call();
    let payableAmount = (web3.utils.toBN(nftPrice)).mul(web3.utils.toBN(numberOfTokens));

    // // Fetch the merkle proof for the current account address
    // const response = await fetch('get_merkle_proof.php?address=' + account);
    // const data = await response.json();
    // const merkleProof = data.merkleProof;

    const merkleProof = [
        "0x000000000000000000000000ed0761641dbdb3c5c6dc15fe98ef94a9ed1451d5"
    ] // remove this, extract from dataset as shown above

    try {
        let txn = await nft.methods.mint(numberOfTokens, merkleProof).send({
            from: account,
            value: payableAmount.toString(),
            gas: EST_GAS
        });
        showSuccess(`Minted successfully! Check it out on <a href='https://testnets.opensea.io/account' target='_blank'>OpenSea</a>`);
    } catch (e) {
        console.log(e);
        if (e.message.includes('User denied transaction signature')) {
            return;
        }
        showError("Minting failed! Please try again");
    }
}

$(function () {
    $('li.mobile-menu').on('click', (e) => {
        $('#burger').click();
    });

    connectButton = $('.btn-connect-wallet');
    connectButton.on('click', (e) => {
        e.preventDefault();
        if (connected) {
            disconnect();
        } else {
            connect();
        }
    });

    connectButton.hover(
        function () {
            $(this).data('connectButtonText', $(this).text());
            $(this).text(connected ? "DISCONNECT" : "CONNECT WALLET");
        },
        function () {
            $(this).text(connected ? displayedAccount : "CONNECT WALLET");
        }
    );

    mintButton = $('.btn-mint');
    mintButton.on('click', (e) => {
        e.preventDefault();
        mint();
    });

    moonpayButton = $('.btn-moonpay');
    moonpayButton.on('click', (e) => {
        e.preventDefault();
        showMoonpayModal();
    });

    connect(false);

    // Handle when the user have window.ethereum
    if (!window.ethereum) return;

    window.ethereum.on('accountsChanged', function (accounts) {
        if (accounts.length > 0) {
            loadAccount(accounts);
        }
    });
    window.ethereum.on('networkChanged', function (chainId) {
        if (chainId != supportedChainId) {
            disconnect();
            showError("Network is not supported! Please switch to ETH Network");
        }
    });
});