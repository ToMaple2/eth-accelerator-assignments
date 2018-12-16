pragma solidity ^0.4.24;

import './ERC721.sol';

contract CryptoBallers is ERC721 {

    struct Baller {
        string name;
        uint level;
        uint offenseSkill;
        uint defenseSkill;
        uint winCount;
        uint lossCount;
    }

    address owner;
    Baller[] public ballers;

    // Mapping for if address has claimed their free baller
    mapping(address => bool) public claimedFreeBaller;

    // Fee for buying a baller
    uint ballerFee = 0.10 ether;

    /**
    * @dev Ensures ownership of the specified token ID
    * @param _tokenId uint256 ID of the token to check
    */
    modifier onlyOwnerOf(uint256 _tokenId) {
        require(msg.sender == _tokenOwner[_tokenId], "Only the owner of a token can access");
        _;
    }

    /**
    * @dev Ensures ownership of contract
    */
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    /**
    * @dev Ensures baller has level above specified level
    * @param _level uint level that the baller needs to be above
    * @param _ballerId uint ID of the Baller to check
    */
    modifier aboveLevel(uint _level, uint _ballerId) {
        require( ballers[_ballerId].level > _level, "Baller is not sufficient level" );
        _;
    }

    constructor() public {
        owner = msg.sender;
    }

    /**
    * @dev Allows user to claim first free baller, ensure no address can claim more than one
    */
    function claimFreeBaller() public {
        require( claimedFreeBaller[msg.sender] == false, "Free baller already claimed" );
        unit ballerId = ballers.length;
        _createBaller( "Baller" + ballerId, 1, 1, 1 );    // offense and defense set to 1
    }

    /**
    * @dev Allows user to buy baller with set attributes
    */
    function buyBaller() public payable {
        // TODO add your code, include fee to buy
        require( msg.value >= ballerFee, "Baller fee is " + ballerFee );
        uint ballerId = ballers.length;
        _createBaller( "Baller" + ballerId, 1, 1, 1 ));    // offense and defense set to 1
    }

    /**
    * @dev Play a game with your baller and an opponent baller
    * If your baller has more offensive skill than your opponent's defensive skill
    * you win, your level goes up, the opponent loses, and vice versa.
    * If you win and your baller reaches level 5, you are awarded a new baller with a mix of traits
    * from your baller and your opponent's baller.
    * @param _ballerId uint ID of the Baller initiating the game
    * @param _opponentId uint ID that the baller needs to be above
    */
    function playBall(uint _ballerId, uint _opponentId) onlyOwnerOf(_ballerId) public {
        // TODO add your code, review code
        require( _ballerId != _opponentId, "Baller and opponent must be different" );  // is this needed?
        if ( ballers[_ballerId].offenseSkill > ballers[_opponentId] ) {
            ballers[_ballerId].offenseSkill = ballers[_ballerId].offenseSkill.add( 1 );
            ballers[_ballerId].winCount = ballers[_ballerId].winCount.add(1);
            ballers[_opponentId].lossCount = ballers[_ballerId].lossCount.add( 1 );
            if ( ballers[_ballerId] >= 5 ) {
                // new baller awarded
                uint ballerId = ballers.length;
                _createBaller( "Baller" + ballerId, _breedBallers( ballers[_ballerId], ballers[_opponentId] ));
            }
        } else {
            ballers[_ballerId].lossCount = ballers[_ballerId].lossCount.add(1);
            ballers[_opponentId].defenseSkill = ballers[_opponentId].defenseSkill.add(1);
            ballers[_opponentId].winCount = ballers[_opponentId].windowCount.add(1);
        }
    }

    /**
    * @dev Changes the name of your baller if they are above level two
    * @param _ballerId uint ID of the Baller who's name you want to change
    * @param _newName string new name you want to give to your Baller
    */
    function changeName(uint _ballerId, string _newName) external aboveLevel(2, _ballerId) onlyOwnerOf(_ballerId) {
        ballers[_ballerId].name = _newName;
    }

    /**
   * @dev Creates a baller based on the params given, adds them to the Baller array and mints a token
   * @param _name string name of the Baller
   * @param _level uint level of the Baller
   * @param _offenseSkill offensive skill of the Baller
   * @param _defenseSkill defensive skill of the Baller
   */
    function _createBaller(string _name, uint _level, uint _offenseSkill, uint _defenseSkill) internal {
        uint ballerId = ballers.length;
        _mint( msg.sender, ballerId );
        Baller newBaller = { name: _name, level: _level, offenseSkill: _offenseSkill, defenseSkill: _defenseSkill };
        ballers[ballerId] = newBaller;
        _tokenOwner[ballerId] = msg.sender;
    }

    /**
    * @dev Helper function for a new baller which averages the attributes of the level, attack, defense of the ballers
    * @param _baller1 Baller first baller to average
    * @param _baller2 Baller second baller to average
    * @return tuple of level, attack and defense
    */
    function _breedBallers(Baller _baller1, Baller _baller2) internal pure returns (uint, uint, uint) {
        uint level = _baller1.level.add(_baller2.level).div(2);
        uint attack = _baller1.offenseSkill.add(_baller2.offenseSkill).div(2);
        uint defense = _baller1.defenseSkill.add(_baller2.defenseSkill).div(2);
        return (level, attack, defense);

    }
}
