//this implements the erc20 standard, incharge of governing the behaviour of our crytocurrency
pragma solidity ^0.4.24;

contract DappToken{
    string public name = "DApp Token";
    string public symbol = "DApp";
    string public standard = "DApp Token v1.0";
    uint256 public totalSupply;
    mapping(address => uint) public balanceOf;
            //key       //value
    mapping(address => mapping(address => uint256)) public allowance;
            //owner            //spender    //value
    event Transfer(
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    constructor(uint256 _intialsupply) public{
        balanceOf[msg.sender] = _intialsupply;
        totalSupply = _intialsupply;
    }

    function transfer(address _to, uint256 _value) public returns (bool success){
        require(balanceOf[msg.sender] >= _value,"doesnt have enough tokens to share");
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value);
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success){
        allowance[msg.sender][_spender] = _value;
        emit Approval(msg.sender,_spender, _value);
        return true;
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success){
        require(_value <= balanceOf[_from],"_value is greater than balance");
        require(_value <= allowance[_from][msg.sender],"_value is greater than allowed");
        emit Transfer(_from, _to, _value);
        balanceOf[_from] -= _value;
        balanceOf[_to] += _value;

        allowance[_from][msg.sender] -= _value;

        return true;
    }
}