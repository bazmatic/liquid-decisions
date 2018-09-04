pragma solidity ^0.4.0;
contract LiquidDecisions {
    
    uint proposalCount;
    uint delegateeCount;

    struct Proposal {
        uint id;
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
    
    event CastVoteEvent(address voter, uint proposalId, bool value);
    event DelegateVoteEvent(address voter, uint proposalId, address delegatee);
    event RegisterDelegateeEvent(address delegatee, string name);
    event DelegateTaggedVotesEvent(address voter, string tag, address delegatee);
    event ProposalEvent(address voter, uint proposalId, string title, string uri, uint duration, string tag);

    Proposal[] public proposals;
    Delegatee[] public delegatees;
    
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
    
    function registerDelegatee(string name) public {
        delegatees.push(Delegatee(msg.sender, name));
        delegateeCount ++;
        emit RegisterDelegateeEvent(msg.sender, name);
    }


}