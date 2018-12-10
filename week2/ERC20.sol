pragma solidity ^0.4.25;

import "./IERC20.sol";
import "./SafeMath.sol";

/**
 * @title Standard ERC20 token
 * @dev Implementation of the basic standard token.
 */
contract ERC20 is IERC20 {
    using SafeMath for uint256;

    mapping (address => uint256) internal _balances;
    mapping (address => mapping (address => uint256)) internal _allowed;
    uint256 internal _totalSupply;

    // -----------------------------------------
    // Public Functions (DO NOT CHANGE!!)
    // -----------------------------------------

    /**
    * @dev Total number of tokens in existence
    */
    function totalSupply() public view returns (uint256) {
        return _totalSupply;
    }

    /**
    * @dev Gets the balance of the specified address.
    * @param owner The address to query the balance of.
    * @return An uint256 representing the amount owned by the passed address.
    */
    function balanceOf(address owner) public view returns (uint256) {
        return _balances[owner];
    }

    /**
    * @dev Function to check the amount of tokens that an owner allowed to a spender.
    * @param owner address The address which owns the funds.
    * @param spender address The address which will spend the funds.
    * @return A uint256 specifying the amount of tokens still available for the spender.
    */
    function allowance(address owner, address spender) public view returns(uint256) {
        return _allowed[owner][spender];
    }

    /**
    * @dev Transfer tokens for a specified address
    * @param to The address to transfer to.
    * @param value The amount to be transferred.
    * @return Should always return true if all conditions are met. Otherwise throw exception.
    */
    function transfer(address to, uint256 value) public validDestination( to ) returns (bool) {
        require( _balances[msg.sender] >= value, "Sender does not have enough balance" );
        _balances[msg.sender] = _balances[msg.sender].add( -value );
        _balances[to] = _balances[to].add( value );
        emit Transfer(msg.sender, to, value);
        return true;
    }

    /**
    * @dev Approve the passed address to spend the specified amount of tokens on behalf of msg.sender.
    * Note that the owner (msg.sender) can approve someone to spend tokens that they do not yet have.
    * @param spender The address which will spend the funds.
    * @param value The amount of tokens to be spent.
    * @return Should always return true if success. Otherwise throw exception.
    */
    function approve(address spender, uint256 value) public returns (bool) {
        require(spender != 0, "Spender address must be specified");
        _allowed[msg.sender][spender] = value;
        emit Approval(msg.sender, spender, value);
        return true;
    }

    /**
    * @dev Transfer tokens from one address to another
    * @param from address The address which you want to send tokens from
    * @param to address The address which you want to transfer to
    * @param value uint256 the amount of tokens to be transferred
    */
    function transferFrom(address from, address to, uint256 value) public validDestination( to ) returns (bool) {
        // require(from != 0, "From address must be specified");
        require(_balances[from] >= value, "Owner does not have enough tokens");
        require(_allowed[from][msg.sender] >= value, "Spender does not have enough allowance");

        //  reduce 'from' (owner) and spender balances
        _balances[from] = _balances[from].add(-value);
        _allowed[from][msg.sender] = _allowed[from][msg.sender].add(-value);

        //  increase the 'to' balance
        _balances[to] = _balances[to].add(value);

        emit Transfer(from, to, value);
    }

    // -----------------------------------------
    // Internal functions (you can write any other internal helper functions here)
    // -----------------------------------------
    modifier validDestination( address to ) {
        require(to != address(0x0));
        require(to != address(this) );
        _;
    }
}
