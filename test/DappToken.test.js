var DappToken = artifacts.require("./DappToken.sol");

contract('DappToken',(accounts)=>{
    var tokenInstance;
    beforeEach(async()=>{
        tokenInstance = await DappToken.deployed();
    })
    it('allocates the correct values',async ()=>{
        var name = await tokenInstance.name();
        assert.equal(name, 'DApp Token','has the correct name');
        var symbol = await tokenInstance.symbol();
        assert.equal(symbol, "DApp",'has the correct symbol');
        var standard = await tokenInstance.standard();
        assert.equal(standard, "DApp Token v1.0",'has the correct standard');
    });
    it('allocates the initial supply upon deployment',async ()=>{
        // return DappToken.deployed().then((instance)=>{
        //     tokenInstance = instance;
        //     return tokenInstance.totalSupply();
        // }).then((totalSupply)=>{
        //     assert.equal(totalSupply.toNumber(),1000000,'sets the total supply to one million');
        // })
        var totalSupply = await tokenInstance.totalSupply();
        var adminBalance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(totalSupply.toNumber(),1000000,'sets the total supply to one million');
        assert.equal(adminBalance.toNumber(),1000000,'it allocates the initial supply to the admin account');
    });
    it('tranfers ownership', async ()=>{
        try{
           assert.fail(await tokenInstance.transfer.call(accounts[1],9999999999));
        }catch(err){
            assert(err.message.indexOf('revert')>=0, 'error message must contain revert');
        }
        var success  =  await tokenInstance.transfer.call(accounts[1], 25000, {from: accounts[0]});
        assert.equal(success, true, 'it returns true');
        var reciept =  await tokenInstance.transfer(accounts[1], 25000, {from: accounts[0]});
        assert.equal(reciept.logs.length, 1, "transfer one event");
        assert.equal(reciept.logs[0].event, 'Transfer', "should be the transfer event");
        assert.equal(reciept.logs[0].args._from, accounts[0], "transfered from");
        assert.equal(reciept.logs[0].args._to, accounts[1], "transfered to");
        assert.equal(reciept.logs[0].args._value, 25000, "transfer amount");

        var balance = await tokenInstance.balanceOf(accounts[1]);
        assert.equal(balance.toNumber(), 25000, 'adds the amount to the recieving account');
        balance = await tokenInstance.balanceOf(accounts[0]);
        assert.equal(balance.toNumber(), 975000, 'deducts the amount from the sending account');
    });

    it('approves tranfer for delecated tokens', async ()=>{
        var success = await tokenInstance.approve.call(accounts[1], 100);
        assert.equal(success, true, 'return value');
        var reciept = await tokenInstance.approve(accounts[1], 100,{ from: accounts[0] });
        assert.equal(reciept.logs.length, 1, "transfer one event");
        assert.equal(reciept.logs[0].event, 'Approval', "should be the transfer event");
        assert.equal(reciept.logs[0].args._owner, accounts[0], "transfered from");
        assert.equal(reciept.logs[0].args._spender, accounts[1], "transfered to");
        assert.equal(reciept.logs[0].args._value, 100, "transfer amount");
        var allowance = await tokenInstance.allowance(accounts[0], accounts[1]);
        assert.equal(allowance.toNumber(), 100, 'stores the allowance for delegated transfer');
    });
    it('handles delegated token transfers',async ()=>{
        fromAccount = accounts[2];
        toAccount = accounts[3];
        spendindAccount = accounts[4];
        //transfer some tokens to fromAccount
        var reciept = await tokenInstance.transfer(fromAccount,100, {from: accounts[0]});
                                                    //fromAccount                  
        //approve spendingaccount to spend 10 tokens from fromAccount
        var reciept1 = await tokenInstance.approve(spendindAccount, 10, {from: fromAccount});
        //try something which is larger than the senders balance
        try{
            assert.fail(await tokenInstance.transferFrom(fromAccount, toAccount, 9999, {from: spendindAccount}));
        }catch(error){
            assert(error.message.indexOf('revert')>=0, 'cannot transfer value larger than balance');
        }
        //try transfering larger than the approvers amount
        try{
            assert.fail(await tokenInstance.transferFrom(fromAccount, toAccount, 20, {from: spendindAccount}));
        }catch(error){
            assert(error.message.indexOf('revert')>=0, 'cannot transfer value larger than approved amount');
        }
        var success = await tokenInstance.transferFrom.call(fromAccount, toAccount, 10, {from: spendindAccount});
        assert.equal(success,true,'transfer from is not true');
        var reciept = await tokenInstance.transferFrom(fromAccount, toAccount, 10, {from: spendindAccount});
        assert.equal(reciept.logs.length, 1, "trigger one event");
        assert.equal(reciept.logs[0].event, 'Transfer', "should be the transfer event");
        assert.equal(reciept.logs[0].args._from, fromAccount, "transfered from");
        assert.equal(reciept.logs[0].args._to, toAccount, "transfered to");
        assert.equal(reciept.logs[0].args._value, 10, "transfer amount");
        var balance = await tokenInstance.balanceOf(fromAccount);
        assert.equal(balance.toNumber(),90, 'deducts the amount from the sending account');
        balance = await tokenInstance.balanceOf(toAccount);
        assert.equal(balance.toNumber(),10, 'adds the amount from the recieving account');
        var allowance = await tokenInstance.allowance(fromAccount, spendindAccount);
        assert.equal(allowance.toNumber(), 0, 'deducts the amount from the allowance');
    });
});