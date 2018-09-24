pragma solidity ^0.4.0;
pragma experimental ABIEncoderV2;

contract LiquidDecisions {
    uint public proposalCount;
    uint public delegateeCount;

    struct Proposal {
        uint id;
        string title;
        string backgroundUrl;
        address proposer;
        uint proposalDate;
        uint expiryDate;
        string tag;
    }

    struct Statement {
        string subject;
        string predicate;
        string object;
        address signatory;
    }
    
    struct Delegatee {
        address addr;
        string name;
        string backgroundUrl; //TMNT?
        string imageUrl;
        bool valid;
    }
    
    event CastVoteEvent(address voter, uint proposalId, bool value);
    event DelegateVoteEvent(address voter, uint proposalId, address delegatee);
    event StatementEvent(address issuer, address subject, string predicate, string object);
    event RegisterDelegateeEvent(address delegatee, string name, string backgroundUrl, string imageUrl);
    event DelegateTaggedVotesEvent(address voter, string tag, address delegatee);
    event ProposalEvent(address voter, uint proposalId, string title, string uri, uint duration, string tag);

    Proposal[] public proposals;
    address[] public delegatees;

    mapping(address => Delegatee) public delegateeIndex;
    
    constructor () public {
        proposalCount = 0;
        delegateeCount = 0;
    }
    
    function makeProposal(string title, string uri, uint duration, string tag) public {
        proposals.push(Proposal(
            proposalCount,
            title,
            uri,
            msg.sender,
            now,
            now + duration,
            tag
        ));
        emit ProposalEvent(msg.sender, proposalCount, title, uri, duration, tag);
        proposalCount ++;
    }

    function castVote(uint proposalId, bool value) public {
        //Stateless
        emit CastVoteEvent(msg.sender, proposalId, value);
    }
    
    function delegateVote(uint proposalId, address delegatee) public {
        //Stateless
        emit DelegateVoteEvent(msg.sender, proposalId, delegatee);
    }
    
    function delegateTaggedVotes(string tag, address delegatee) public {
        //Stateless
        emit DelegateTaggedVotesEvent(msg.sender, tag, delegatee);
    }

    function getDelegatee(uint itemIndex) public view returns (Delegatee) {
        return delegateeIndex[delegatees[itemIndex]];
    }
    
    function registerDelegatee(string name, string backgroundUrl, string imageUrl) public {
        Delegatee memory delegatee = delegateeIndex[msg.sender];
        if (!delegatee.valid) {               
            delegatee = Delegatee(msg.sender, name, backgroundUrl, imageUrl, true);
            delegatees.push(msg.sender);
            delegateeCount ++;                  
        }
        delegateeIndex[msg.sender] = Delegatee(msg.sender, name, backgroundUrl, imageUrl, true);  
        emit RegisterDelegateeEvent(msg.sender, name, backgroundUrl, imageUrl);    
    }

    function makeStatement(address subject, string predicate, string object) public {
        emit StatementEvent(msg.sender, subject, predicate, object);
    }
}