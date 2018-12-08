pragma solidity ^0.4.25;

import "./IERC20.sol";
import "./SafeMath.sol";

contract Crowdsale {
    using SafeMath for uint256;

    uint256 private cap; // maximum amount of ether to be raised
    uint256 private weiRaised; // current amount of wei raised

    uint256 private rate; // price in wei per smallest unit of token (e.g. 1 wei = 10 smallest unit of a token)
    address private wallet; // wallet to hold the ethers
    IERC20 private token; // address of erc20 tokens

   /**
    * Event for token purchase logging
    * @param purchaser who paid for the tokens
    * @param beneficiary who got the tokens
    * @param value weis paid for purchase
    * @param amount amount of tokens purchased
    */
    event TokensPurchased(
        address indexed purchaser,
        address indexed beneficiary,
        uint256 value,
        uint256 amount
    );

    // -----------------------------------------
    // Public functions (DO NOT change the interface!)
    // -----------------------------------------
   /**
    * @param _rate Number of token units a buyer gets per wei
    * @dev The rate is the conversion between wei and the smallest and indivisible token unit.
    * @param _wallet Address where collected funds will be forwarded to
    * @param _token Address of the token being sold
    */
    constructor(uint256 _rate, address _wallet, IERC20 _token) public {
        rate = _rate;
        wallet = _wallet;
        token = _token;
        cap = 2500; // hardcoded cap
    }

    /**
    * @dev Fallback function for users to send ether directly to contract address
    */
    function() external payable {
        buyTokens(msg.sender);
    }

    function buyTokens(address beneficiary) public payable {
        //  - Validate any conditions
        require(msg.value > 0, "No ether sent");
        require( msg.sender != wallet, "Sender cannot be wallet");
        //  check we have enough wei left to sell
        // require( msg.value <= (cap - token.totalSupply()), "Not enough tokens left");

        //  - Calculate number of tokens
        uint256 nbrOfTokens = msg.value / rate;

        //  - Update any states
        weiRaised = weiRaised.add(msg.value);

        //  - Transfer tokens
        token.approve(msg.sender, nbrOfTokens);
        token.transferFrom(address(this), beneficiary, nbrOfTokens);

        //  - Forward funds to wallet
        wallet.transfer(msg.value);

        //  - Emit event
        emit TokensPurchased(msg.sender, beneficiary, msg.value, nbrOfTokens);
    }

    /**
    * @dev Checks whether the cap has been reached.
    * @return Whether the cap was reached
    */
    function capReached() public view returns (bool) {
        return (weiRaised >= cap);
    }

    // -----------------------------------------
    // Internal functions (you can write any other internal helper functions here)
    // -----------------------------------------
    function balanceOfWallet() public view returns(uint256) {
        return token.balanceOf( wallet );
    }
    function capAmount() public view returns(uint256) {
        return cap;
    }

    function weiRaisedAmount() public view returns(uint256) {
        return weiRaised;
    }

}
