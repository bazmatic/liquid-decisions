# Liquid Decisions


### Checkout repo

```
git clone https://github.com/bazmatic/liquid-decisions
```


### Install the deps

```
npm install
```

### Install truffle

```
npm install truffle --global
```

### Compile Contract 

```
truffle compile
```


## Python

Smart contract methods:

```python
castVote(bytes32,bool)
delegateTaggedVotes(string,address)
delegateVote(bytes32,address)
delegateeCount()
delegatees(uint256)
grantAdminRole(address,bool)
grantVoterRole(address,bool)
makeProposal(string,string,uint256,string)
proposalCount()
proposals(uint256)
registerDelegatee(string)
```