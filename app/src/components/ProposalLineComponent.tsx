import * as React from 'react';
import {Proposal} from '../modules/LiquidDecisions'

type Props = {
    proposal: Proposal,
    onSelect: Function | undefined
}

export default class ProposalLineComponent extends React.Component <Props, { proposal: Proposal }> {
    key: string
    data: Proposal

	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {}
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    private onSelect() {
        this.props.onSelect(this.state.proposal)
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div className="proposalLine"></div>
        } 
        else {
            return (
                <div className="proposalLine" onClick={this.onSelect.bind(this)}>
                    <h3>{this.state.proposal.id} {this.state.proposal.title}</h3>
                    <a href={this.state.proposal.uri}>More info</a>
                </div>
            )
        }
    }

}