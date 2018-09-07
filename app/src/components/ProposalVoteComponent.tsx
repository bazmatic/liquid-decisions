import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { DelegateeSelectorComponent } from './DelegateeSelectorComponent'

type Props = {
    proposal: LiquidDecisions.Proposal,
    delegatees: LiquidDecisions.Delegatee[]
}

export class ProposalVote extends React.Component <Props, { proposal: LiquidDecisions.Proposal, delegatees?: LiquidDecisions.Delegatee[], selectedDelegatee?: LiquidDecisions.Delegatee }> {

	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {},
            delegatees: props.delegatees || [],
            selectedDelegatee: undefined
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    private async vote(value: boolean) {
        let result = await LiquidDecisions.Contract.castVote(this.state.proposal.id, value)
    }

    private async delegateVote() {
        if (this.state.selectedDelegatee !== undefined) {
            let result = await LiquidDecisions.Contract.delegateVote(this.state.proposal.id, this.state.selectedDelegatee.address)    
        }
        else {
            console.log('No selected delegatee')
        }
    }

    private async onSelectDelegatee(selectedDelegatee: LiquidDecisions.Delegatee) {
        debugger
        this.setState({selectedDelegatee})
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div className="stitch"></div>
        } 
        else {
            let delegationContent
            if (this.state.selectedDelegatee == undefined) {
                delegationContent = <DelegateeSelectorComponent delegatees={this.state.delegatees} onSelect={this.onSelectDelegatee.bind(this)} />
            }
            else {
                delegationContent = <button onClick={this.delegateVote.bind(this)}>Delegate to {this.state.selectedDelegatee.name}</button>
            }
            return (
                <div className="proposal">
                    <h3>{this.state.proposal.id}. {this.state.proposal.title}</h3>
                    <a href={this.state.proposal.uri}>More info</a>
                    <button onClick={this.vote.bind(this, true)}>Vote YES</button>
                    <button onClick={this.vote.bind(this, false)}>Vote NO</button>
                    {delegationContent}              
                </div>
            )
        }
    }

}