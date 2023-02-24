// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Deployed to Goerli at 0x60699721AC86604e16582a00c9efC1D79b743767 

// Import this file to use console.log
// import "hardhat/console.sol";

contract GetSponsor {

    // Event emitted when the a Meno is created.
    event NewMemo(address indexed from, uint timestamp, string name, string message);

    // Memp struct 
    struct Memo{
        address from;
        uint timestamp;
        string name;
        string message;
        // string signature;
    }
    
    // list of all the memos of the firends
    Memo[] memo;

    // Address of the contract deployer.
    address payable owner;

    // Deploy logic.
    constructor(){
        owner = payable(msg.sender);
    }

    /**
    * @dev get the sponsorship.
    * @param _name the name  of sponsor.
    * @param _message the message of sponsor.
    **/ 
    function sponsor(string memory _name, string memory _message) public payable{
        // cheack for value is non 0
        require(msg.value > 0, "Value must be greater than 0");

        // add memo to the list of memos 
        memo.push(Memo(
            msg.sender,
            block.timestamp,
            _name,
            _message
        ));

        // emit new meno event
        emit NewMemo(msg.sender, block.timestamp, _name, _message); 
    }
        
        /**
        * @dev send the sponsorship form contract to the owmer.
        **/ 
        function withdrawSponsorship() public {
            require(owner.send(address(this).balance));
            // withdraw the value from the contract
            // owner.transfer(msg.value);
        }
        
        /**
        * @dev return the list of memos.
        **/ 
        function getMemos() public view returns(Memo[] memory){
            return memo;
        }

}
