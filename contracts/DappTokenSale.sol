pragma solidity ^0.4.24;
import "./DappToken.sol";

contract DappTokenSale{

    address admin;
    DappToken public tokenContract;
    uint256 public tokenPrice;
    uint256 public tokensSold;

    event Sell(address _buyer, uint _amount);

    constructor(DappToken _tokenContract, uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }

    function multiply(uint x, uint y) internal pure returns (uint z){
        require(y==0 || (z = x * y)/y==x, "return");
    }

    function buyTokens(uint256 _numberOfTokens) public payable{
        require(msg.value == multiply(_numberOfTokens,tokenPrice),"msg.value == tokenprice");
        require(tokenContract.balanceOf(this) >= _numberOfTokens, "checks whether the smart contract has enough tokens");
        require(tokenContract.transfer(msg.sender, _numberOfTokens),"requires the transfer to be successfull");
        tokensSold += _numberOfTokens;
        emit Sell(msg.sender, _numberOfTokens);
        //require that value is equal to tokens
        //require that there are enough tokens in the contract
        //require that a transfer is successfull
        //keep track of number of tokensSold
        //trigger sell event
    }
    //ending the token sale
    function endSale() public restricted {
        require(tokenContract.transfer(admin, tokenContract.balanceOf(this)),"transfer the remaining tokens in the contract");
        selfdestruct(admin);
    }

    modifier restricted(){
        require(msg.sender == admin, "restricted to admin");
        _;
    }
}