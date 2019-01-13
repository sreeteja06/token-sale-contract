Transfer = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  loading: false,
  init: () => {
    console.log("transfer page intialized");
    return Transfer.initWeb3();
  },
  initWeb3: () => {
    if (typeof web3 !== "undefined") {
      Transfer.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      Transfer.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(Transfer.web3Provider);
    }
    return Transfer.initContracts();
  },
  initContracts: () => {
    $.getJSON("DappTokenSale.json", function(dappTokenSale) {
      Transfer.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      Transfer.contracts.DappTokenSale.setProvider(Transfer.web3Provider);
      Transfer.contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
        console.log("Dapp Token Sale Address:", dappTokenSale.address);
      });
    }).done(function() {
      $.getJSON("DappToken.json", function(dappToken) {
        Transfer.contracts.DappToken = TruffleContract(dappToken);
        Transfer.contracts.DappToken.setProvider(Transfer.web3Provider);
        Transfer.contracts.DappToken.deployed().then(function(dappToken) {
          console.log("Dapp Token Address:", dappToken.address);
        });
  })
});
  },
}

$(() => {
  $(window).load(() => {
    Transfer.init();
  });
});