

import { Delegatee, Voter, Proposal, Contract } from './LiquidDecisions'
enum EventTypes { CastVoteEvent = 'CastVoteEvent', DelegateVoteEvent = 'DelegateVoteEvent' }

export type Voter = {
    addr: string
    delegatee: Voter
    delegators: any
    voteValue: boolean  
    processed: boolean
}

export type Proposal = {
    title: string
    uri: string
    duration: number
    tag: string  
}

export type Delegatee = {
    name: string
    addr: string
}


export class ProposalResolver {
    abi: any
    voterIndex: any
    proposalId: number
    result: any
    constructor(proposalId: number) {
        this.proposalId = proposalId
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
       voter.delegatee.delegators[voter.addr] = voter
    }

    getVoter(addr: string): Voter {
        if (!this.voterIndex[addr]) {
            this.putVoter(
                {
                    addr: addr,
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
        this.voterIndex[voter.addr] = voter
    }

    undelegate(voter: Voter) {
        if (voter.delegatee) {
            let oldDelegatee = voter.delegatee
            delete oldDelegatee.delegators[voter.delegatee.addr]
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
        let events = await Contract.getEvents(this.proposalId)
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
    
}

//window['VoterNetwork'] = VoterNetwork




