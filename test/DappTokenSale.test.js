var DappTokenSale = artifacts.require('./DappTokenSale.sol');
var DappToken = artifacts.require('./DappToken.sol');

contract('DappTokenSale', (accounts)=>{
    var tokenSaleInstance;
    var tokenInstance;
    var tokenPrice = 100000000000000;
    var admin = accounts[0];
    var buyer = accounts[1];
    var tokensAvailable = 750000;
    var numberOfTokens;
    it('intializes the tokens with the correct values',async()=>{
        tokenSaleInstance = await DappTokenSale.deployed();
        var address = await tokenSaleInstance.address;
        assert.notEqual(address, 0x0, 'has contract address');
        var tokenAddress = await tokenSaleInstance.tokenContract();
        console.log(tokenAddress);
        assert.notEqual(tokenAddress, 0x0, 'has token contract address');
        var price = await tokenSaleInstance.tokenPrice();
        assert.equal(price, tokenPrice, 'token price check');
    });

    it("ends token sale", async ()=>{
        tokenInstance = await DappToken.deployed();
        tokenSaleInstance = await DappTokenSale.deployed();
        var reciept1 = await tokenInstance.transfer(tokenSaleInstance.address, tokensAvailable, {from: admin});
        
        var receipt = await tokenSaleInstance.endSale({from: admin});
        // var balance = await tokenInstance.balanceOf(admin);
        // assert.equal(balance.toNumber(), 1000000, "returns all unsold tokens to the admin");
        // var tokenprice = await tokenSaleInstance.tokenPrice();
        // assert.equal(tokenPrice,0,"check that the contract sucided");
    })

    // it('facilitales token buy', async()=>{
    //     tokenInstance = await DappToken.deployed();
    //     tokenSaleInstance = await DappTokenSale.deployed();
    //     numberOfTokens = 10;
    //     var reciept2 = await tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens*tokenPrice});
    //     var reciept = await tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: numberOfTokens*tokenPrice});
    //     assert.equal(reciept.logs.length, 1, 'triggers one event');
    //     assert.equal(reciept.logs[0].event, 'Sell', 'should be the sell event');
    //     assert.equal(reciept.logs[0].args._buyer, buyer, 'logs the account that purchased the accounts');
    //     assert.equal(reciept.logs[0].args._amount, numberOfTokens, 'logs the number of tokens purchased');
    //     var amount = await tokenSaleInstance.tokensSold();
    //     assert.equal(amount.toNumber(), numberOfTokens, 'increases the number of tokens sold'); 
    //     // assert.ok(await tokenSaleInstance.buyTokens(numberOfTokens, {from: buyer, value: 1 }));
    // });
});