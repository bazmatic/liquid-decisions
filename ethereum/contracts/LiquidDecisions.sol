pragma solidity ^0.5.4;
contract LiquidDecisions {
    address owner;
    mapping(address => bool) private _voterRole;
    mapping(address => bool) private _adminRole;

    uint public proposalCount;
    uint public delegateeCount;

    struct Proposal {
        bytes32 id;
        string title;
        string uri;
        address proposer;
        uint proposalDate;
        uint expiryDate;
        string tag;
    }
    
    struct Delegatee {
        address addr;
        string name;
    }
    
    event CastVoteEvent(address voter, bytes32 proposalId, bool value);
    event DelegateVoteEvent(address voter, bytes32 proposalId, address delegatee);
    event RegisterDelegateeEvent(address delegatee, string name);
    event DelegateTaggedVotesEvent(address voter, string tag, address delegatee);
    event ProposalEvent(address voter, bytes32 proposalId, string title, string uri, uint duration, string tag);

    Proposal[] public proposals;
    Delegatee[] public delegatees;
    
    constructor () public {
        proposalCount = 0;
        delegateeCount = 0;
        owner = msg.sender;
        grantAdminRole(msg.sender, true);
    }
    
    function makeProposal(string memory title, string memory uri, uint duration, string memory tag) public onlyAdmin {
        bytes32 id = keccak256(abi.encodePacked(title, uri, duration, tag));
        proposals.push(Proposal(
            id,
            title,
            uri,
            msg.sender,
            now,
            now + duration,
            tag
        ));
        emit ProposalEvent(msg.sender, id, title, uri, duration, tag);
        proposalCount ++;
    }

    function grantVoterRole(address addr, bool grant) public onlyAdmin {
        _voterRole[addr] = grant;
    }

    function grantAdminRole(address addr, bool grant) public onlyAdmin {
        _adminRole[addr] = grant;
    }

    modifier onlyOwner () {
        require(msg.sender == owner, "Owner only");
        _;
    }

    modifier onlyAdmin () {
        require(_adminRole[msg.sender] == true || msg.sender == owner, "Owner or registered admins only");
        _;
    }

    modifier onlyVoter () {
        require(_voterRole[msg.sender] == true, "Registered voters only");
        _;
    }

    function castVote(bytes32 proposalId, bool value) public onlyVoter {
        //Stateless
        emit CastVoteEvent(msg.sender, proposalId, value);
    }
    
    function delegateVote(bytes32 proposalId, address delegatee) public onlyVoter {
        //Stateless
        emit DelegateVoteEvent(msg.sender, proposalId, delegatee);
    }
    
    function delegateTaggedVotes(string memory tag, address delegatee) public onlyVoter {
        //Stateless
        emit DelegateTaggedVotesEvent(msg.sender, tag, delegatee);
    }
    
    function registerDelegatee(string memory name) public onlyVoter {
        delegatees.push(Delegatee(msg.sender, name));
        delegateeCount ++;
        emit RegisterDelegateeEvent(msg.sender, name);
    }
}