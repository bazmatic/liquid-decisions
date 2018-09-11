import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { ProposalResolver } from '../modules/ProposalResolver'
import { Paper } from '@material-ui/core';

const MS_DAY: number = 60000 * 60 * 24

type Props = {
    proposal: LiquidDecisions.Proposal,
    delegatees: LiquidDecisions.Delegatee[]
}

type Result = {
    yes: number,
    no: number,
    lost: number
}

export class ProposalResult extends React.Component <Props, { proposal: LiquidDecisions.Proposal, result: any}> {

    private resolver: ProposalResolver

	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {},
            result: {}
        }
        this.resolver = new ProposalResolver(props.proposal.id)
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    } 

    public async getResult() {
        let result = await this.resolver.calculateResult()
        this.setState({result})
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div></div>
        } 
        else {
            return (

                <Paper className="proposalResult">
             
                </Paper>
            )
        }
    }

}