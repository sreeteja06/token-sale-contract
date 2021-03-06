//geth --rinkeby --rpc --rpcapi="personal,eth,network,web3,net" --ipcpath "~/.ethereum/geth.ipc"
App = {
  web3Provider: null,
  contracts: {},
  account: "0x0",
  loading: false,
  tokenPrice: 100000000000000,
  tokensSold: 0,
  tokensAvailable: 750000,
  init: () => {
    console.log("App intialized...");
    return App.initWeb3();
  },

  initWeb3: () => {
    if (typeof web3 !== "undefined") {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
      web3 = new Web3(App.web3Provider);
    }
    return App.initContracts();
  },

  initContracts: function() {
    $.getJSON("DappTokenSale.json", function(dappTokenSale) {
      App.contracts.DappTokenSale = TruffleContract(dappTokenSale);
      App.contracts.DappTokenSale.setProvider(App.web3Provider);
      App.contracts.DappTokenSale.deployed().then(function(dappTokenSale) {
        console.log("Dapp Token Sale Address:", dappTokenSale.address);
      });
    }).done(function() {
      $.getJSON("DappToken.json", function(dappToken) {
        App.contracts.DappToken = TruffleContract(dappToken);
        App.contracts.DappToken.setProvider(App.web3Provider);
        App.contracts.DappToken.deployed().then(function(dappToken) {
          console.log("Dapp Token Address:", dappToken.address);
        });
        App.listenForEvents();
        return App.render();
      });
    });
  },

  listenForEvents: ()=>{
    App.contracts.DappTokenSale.deployed().then((instance)=>{
      instance.Sell({},{
        fromBlock: 0,
        toBlock: 'latest',   
      }).watch((err, event)=>{
        console.log("Event Triggered", event);
        App.render();
      })
    })
  },

  render: () => {
    if (App.loading) {
      return;
    }
    App.loading = true;

    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    web3.eth.getCoinbase(function(err, account) {
      if (err == null) {
        App.account = account;
        $("#AccountAddress").html("Your Account: " + account);
      }
    });
    //Load tokenSale contract
    App.contracts.DappTokenSale.deployed().then((instnace)=>{
        dappTokenSaleInstance = instnace;
        return dappTokenSaleInstance.tokenPrice();
    }).then((tokenPrice)=>{
        App.tokenPrice = tokenPrice;
        $('.token-price').html(web3.fromWei(App.tokenPrice.toNumber(), "ether"));
        return dappTokenSaleInstance.tokensSold();
    }).then((tokensSold)=>{
        App.tokensSold = tokensSold.toNumber();
        $('.tokens-sold').html(App.tokensSold);
        $('.tokens-available').html(App.tokensAvailable);

        var progressPercent = (App.tokensSold / App.tokensAvailable) * 100;
        $('#progress').css('width', progressPercent + '%');

        //Load token contract
        App.contracts.DappToken.deployed().then((instance)=>{
            dappTokenInstance = instance;
            return dappTokenInstance.balanceOf(App.account);
        }).then((balance)=>{
            console.log(balance.toNumber())
            $('.dapp-balance').html(balance.toNumber());
          })
          App.loading = false;
          loader.hide();
          content.show();
    })

  },

  buyTokens: ()=>{
    $('#content').hide();
    $('#loader').show();
    var numberOfTokens = $('#numberOfToken').val();
    App.contracts.DappTokenSale.deployed().then((instance)=>{
      return instance.buyTokens(numberOfTokens, {
        from: App.account,
        value: numberOfTokens * App.tokenPrice,
        gas: 500000
      })
    }).then((result)=>{
      console.log("Tokens Brought");
      $('form').trigger('reset');
      //wait for sell event
    })
  }

};

$(() => {
  $(window).load(() => {
    App.init();
  });
});
