import { Delegatee, Voter, Proposal, Contract } from './LiquidDecisions'

export enum EventTypes { CastVoteEvent = 'CastVoteEvent', DelegateVoteEvent = 'DelegateVoteEvent' }

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

export type ProposalTally = {
    yes: number
    no: number
    lost: number
}

export class ProposalResolver {
    abi: any
    voterIndex: any
    proposalId: number
    result: ProposalTally
    constructor(proposalId: number) {
        this.proposalId = proposalId
        this.voterIndex = {}
        this.resetTally()
    }

    private registerVote(voterAddress: string, voteValue: boolean) {
        let voter = this.getVoter(voterAddress)
        voter.voteValue = voteValue?true:false
        this.undelegate(voter)
    }

    private registerDelegation(voterAddress: string, delegateeAddress: string) {
        
        let voter = this.getVoter(voterAddress)
        let delegatee = this.getVoter(delegateeAddress)

        if (this.hasCircularDelegation(voter, delegatee)) {           
            console.warn("Found circular delegation. Not delegating.")
        }
        else {
            delete voter.voteValue
            voter.delegatee = this.getVoter(delegateeAddress)
            voter.delegatee.delegators[voter.addr] = voter
        }
    }

    private hasCircularDelegation(voter: Voter, delegatee: Voter): boolean {
        //Look down the chain of delegation for any reference to anything already on the delegation chain
        let chainContentIndex: any = {}
        let currentVoter: Voter = delegatee
        let voterIsInDelegationChain: boolean = false

        chainContentIndex[voter.addr] = true

        while(currentVoter.delegatee !== undefined && voterIsInDelegationChain == false) {
            if (chainContentIndex[currentVoter.delegatee.addr] !== undefined) {
                voterIsInDelegationChain = true
            }
            else {
                chainContentIndex[currentVoter.addr] = true
                currentVoter = currentVoter.delegatee
            }
        }

        return voterIsInDelegationChain
    }

    private getVoter(addr: string): Voter {
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

    private putVoter(voter: Voter) {
        this.voterIndex[voter.addr] = voter
    }

    private undelegate(voter: Voter) {
        if (voter.delegatee) {
            let oldDelegatee = voter.delegatee
            delete oldDelegatee.delegators[voter.addr]
            delete voter.delegatee
        }
    }

    private resetTally() {
        this.result = {
            yes: 0,
            no: 0,
            lost: 0
        }
    }
    private tally(voteValue: any, votes: number) {
        if (voteValue === true) {
            this.result.yes += votes
        }
        else if (voteValue === false || voteValue === null) {
            this.result.no += votes
        }
        else {
            this.result.lost += votes
        }
    }

    private _reapDelegators(delegators: Array<Voter>): number{
        let result = delegators.length
        delegators.forEach((delegator: Voter)=>{
            if (Object.values(delegator.delegators).length) {
                result += this._reapDelegators(Object.values(delegator.delegators))
            }
        })
        return result
    }
    
    public async calculateResult(events?: any[]): Promise<ProposalTally> {
        return new Promise<ProposalTally>(async (resolve: any, reject: any) => {
            try {
                this.resetTally()
                if (events === undefined) {
                    events = await Contract.getEvents(this.proposalId)
                }
                await this.registerEvents(events)

                for (let voterAddress in this.voterIndex) {
                    let voter = this.getVoter(voterAddress)
                    //If they voted, add their vote and those of their delegators
                    if (voter.voteValue !== undefined) {
                        this.tally(voter.voteValue, this._reapDelegators(Object.values(voter.delegators))+1) 
                    }
                    
                    //If they did not vote, did not delegate, and had delegators... very bad behaviour!
                    else if (voter.delegatee == undefined && Object.values(voter.delegators).length > 0) {
                        let lostVotes: number = this._reapDelegators(Object.values(voter.delegators))
                        console.warn(`${voterAddress} did not vote and lost ${lostVotes} votes`)
                        this.tally(voter.voteValue, lostVotes)
                    }
                    //If they did not vote, but delegated,
                    else if (voter.delegatee) {
                        //nothing to do
                    }
                    else {
                        //Somehow they didn't vote or delegate!
                        console.warn(`${voterAddress} did not vote`)
                    }
                }
                resolve(this.result)
            }
            catch (err) {
                reject(err)
            }
        })
    }
    private async registerEvents(events: any): Promise<void> {
        return new Promise<void>(async (resolve: any, reject: any) => {
            try {
                events.forEach((item)=>{
                    let eventDetails: any = item.returnValues
                    if (item.event === EventTypes.CastVoteEvent) {
                        this.registerVote(eventDetails.voter, eventDetails.value)
                    }
                    else if (item.event === EventTypes.DelegateVoteEvent) {
                        this.registerDelegation(eventDetails.voter, eventDetails.delegatee)
                    }
                }) 
                resolve() 
            }
            catch (err) {
                reject(err)
            }
        })

    }
    
}

//window['VoterNetwork'] = VoterNetwork




