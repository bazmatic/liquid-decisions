import Web3 from 'web3';

//const web3 = new Web3('https://rinkeby.infura.io/s1tfpFETHbLYVlvd7CRk');
const web3 = new Web3('https://ropsten.infura.io/s1tfpFETHbLYVlvd7CRk');

var STARTING_BLOCK = 1891409;
var CONTRACT_ADDRESS = "0xa117e2e59b2d323d2fd52ae0b615359e51e54de8"

enum EventTypes { CastVoteEvent = 'CastVoteEvent', DelegateVoteEvent = 'DelegateVoteEvent' }

interface Voter {
	address: string
	delegatee: Voter
	delegators: any
    voteValue: boolean  
    processed: boolean
}

class VoterNetwork {
    abi: any
    contract: any
    voterIndex: any
    proposalId: number
    result: any
    constructor(proposalId: number) {
        this.proposalId = proposalId
        let abi = [
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "voter",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "tag",
                        "type": "string"
                    },
                    {
                        "indexed": false,
                        "name": "delegatee",
                        "type": "address"
                    }
                ],
                "name": "DelegateTaggedVotesEvent",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "proposalId",
                        "type": "uint256"
                    },
                    {
                        "name": "value",
                        "type": "bool"
                    }
                ],
                "name": "castVote",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "tag",
                        "type": "string"
                    },
                    {
                        "name": "delegatee",
                        "type": "address"
                    }
                ],
                "name": "delegateTaggedVotes",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "proposalId",
                        "type": "uint256"
                    },
                    {
                        "name": "delegatee",
                        "type": "address"
                    }
                ],
                "name": "delegateVote",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "delegatee",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "name",
                        "type": "string"
                    }
                ],
                "name": "RegisterDelegateeEvent",
                "type": "event"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "voter",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "proposalId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "delegatee",
                        "type": "address"
                    }
                ],
                "name": "DelegateVoteEvent",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "name": "uri",
                        "type": "string"
                    },
                    {
                        "name": "duration",
                        "type": "uint256"
                    },
                    {
                        "name": "tag",
                        "type": "string"
                    }
                ],
                "name": "makeProposal",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "anonymous": false,
                "inputs": [
                    {
                        "indexed": false,
                        "name": "voter",
                        "type": "address"
                    },
                    {
                        "indexed": false,
                        "name": "proposalId",
                        "type": "uint256"
                    },
                    {
                        "indexed": false,
                        "name": "value",
                        "type": "bool"
                    }
                ],
                "name": "CastVoteEvent",
                "type": "event"
            },
            {
                "constant": false,
                "inputs": [
                    {
                        "name": "name",
                        "type": "string"
                    }
                ],
                "name": "registerDelegatee",
                "outputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "function"
            },
            {
                "inputs": [],
                "payable": false,
                "stateMutability": "nonpayable",
                "type": "constructor"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "delegatees",
                "outputs": [
                    {
                        "name": "addr",
                        "type": "address"
                    },
                    {
                        "name": "name",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            },
            {
                "constant": true,
                "inputs": [
                    {
                        "name": "",
                        "type": "uint256"
                    }
                ],
                "name": "proposals",
                "outputs": [
                    {
                        "name": "id",
                        "type": "uint256"
                    },
                    {
                        "name": "title",
                        "type": "string"
                    },
                    {
                        "name": "uri",
                        "type": "string"
                    },
                    {
                        "name": "proposer",
                        "type": "address"
                    },
                    {
                        "name": "proposalDate",
                        "type": "uint256"
                    },
                    {
                        "name": "expiryDate",
                        "type": "uint256"
                    },
                    {
                        "name": "tag",
                        "type": "string"
                    }
                ],
                "payable": false,
                "stateMutability": "view",
                "type": "function"
            }
        ]
        this.contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)
        this.voterIndex = {}
        this.resetTally()
    }

    registerVote(voterAddress: string, voteValue: boolean) {
        let voter = this.getVoter(voterAddress)
        voter.voteValue = voteValue?true:false
        this.undelegate(voter)
    }

    registerDelegation(voterAddress: string, delegateeAddress: string) {
       let voter = this.getVoter(voterAddress)
       voter.delegatee = this.getVoter(delegateeAddress)
       voter.delegatee.delegators[voter.address] = voter
    }

    getVoter(addr: string): Voter {
        if (!this.voterIndex[addr]) {
            this.putVoter(
                {
                    address: addr,
                    voteValue: undefined,
                    delegatee: undefined,
                    delegators: {},
                    processed: false
                }
            )              
        }
        return this.voterIndex[addr]              
    }

    putVoter(voter: Voter) {
        this.voterIndex[voter.address] = voter
    }

    undelegate(voter: Voter) {
        if (voter.delegatee) {
            let oldDelegatee = voter.delegatee
            delete oldDelegatee.delegators[voter.delegatee.address]
            delete voter.delegatee
        }
    }
    resetTally() {
        this.result = {
            yes: 0,
            no: 0,
            lost: 0
        }
    }
    tally(voteValue: any, votes: number) {
        if (voteValue == true) {
            this.result.yes += votes
        }
        else if (voteValue == false || voteValue == null) {
            this.result.no += votes
        }
        else {
            this.result.lost += votes
        }
    }

    //TODO: Eliminate delegation loops
    _reapDelegators(delegators: Array<Voter>): number{
        let result = delegators.length + 1
        delegators.forEach((delegator: Voter)=>{
            if (delegator.delegators.length) {
                result += this._reapDelegators(Object.values(delegator.delegators))
            }
        })
        return result
    }
    
    async calculateResult() {
        this.resetTally()
        await this.registerEvents()
        for (let voterAddress in this.voterIndex) {

            let voter = this.getVoter(voterAddress)
            //If they voted, add their vote and those of their delegators
            if (voter.voteValue !== undefined) {
                this.tally(voter.voteValue, this._reapDelegators(Object.values(voter.delegators))) 
            }
            
            //If they did not vote, did not delegate, and had delegators... very bad behaviour!
            else if (voter.delegatee == undefined && voter.delegators.length > 0) {
                let lostVotes: number = this._reapDelegators(Object.values(voter.delegators))
                console.warn(`${voter} did not vote and lost ${lostVotes} votes`)
                this.tally(voter.voteValue, lostVotes)
            }
            //If they did not vote, but delegated,
            else if (voter.delegatee) {
                //nothing to do
            }
            else {
                //Somehow they didn't vote or delegate!
                console.warn(`${voter} did not vote`)
            }

        }
        console.log(this.result)
    }
    async registerEvents() {
        let events = await this.getEvents()
        events.forEach((item)=>{
            let eventDetails: any = item.returnValues
            if (item.event === EventTypes.CastVoteEvent) {
                this.registerVote(eventDetails.voter, eventDetails.value)
            }
            else if (item.event === EventTypes.DelegateVoteEvent) {
                this.registerDelegation(eventDetails.voter, eventDetails.delegatee)
            }
        })
    }
    async getEvents()  {
        let voteEvents: Array<any> = (await this.contract.getPastEvents(
            'allEvents',
            {
                //filter: {proposalId: proposalId.toString()}, 
                fromBlock: STARTING_BLOCK,
                toBlock: 'latest'
            },
        )).filter((item)=>(item.returnValues.proposalId == this.proposalId))

        return voteEvents 
    }  
}

window['VoterNetwork'] = VoterNetwork




