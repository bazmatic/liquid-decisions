import * as React from 'react';
import {Proposal} from '../modules/LiquidDecisions'

type Props = {
    proposal: Proposal,
    onSelect: Function | undefined
}

export default class ProposalComponent extends React.Component <Props, { proposal: Proposal }> {
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

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div></div>
        } 
        else {
            return (
                <div className="proposal">
                    <h3>{this.state.proposal.title}</h3>
                    <a href={this.state.proposal.uri}>More info</a>
                </div>
            )
        }
    }

}