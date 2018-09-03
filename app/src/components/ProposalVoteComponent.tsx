import * as React from 'react';
import {Proposal, Delegatee} from '../modules/VoterNetwork'
import {DelegateeSelectorComponent} from './DelegateeSelectorComponent'

type Props = {
    proposal: Proposal
}

export default class ProposalVoteComponent extends React.Component <Props, { proposal: Proposal }> {

    data: Proposal
    delegatees: Delegatee[] = []

	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {}
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    public voteYes() {

    }

    public voteNo() {

    }

    public delegateVote(delegatee: Delegatee) {

    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div className="proposal"></div>
        } 
        else {
            return (
                <div className="proposal">
                    <h3>{this.state.proposal.title}</h3>
                    <a href={this.state.proposal.uri}>More info</a>
                    <a className="btn" onClick={this.voteYes.bind(this)}>
						Vote YES
					</a> 
                    <a className="btn" onClick={this.voteNo.bind(this)}>
						Vote NO
					</a> 
                    <DelegateeSelectorComponent delegatees={this.delegatees} onSelect={(delegatee: Delegatee)=>{this.delegateVote(delegatee)}} />

                </div>
            )
        }
    }

}