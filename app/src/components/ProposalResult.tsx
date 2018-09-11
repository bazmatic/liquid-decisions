import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { ProposalResolver, ProposalTally } from '../modules/ProposalResolver'
import { Paper } from '@material-ui/core';

const MS_DAY: number = 60000 * 60 * 24

type Props = {
    proposal: LiquidDecisions.Proposal
}

export class ProposalResult extends React.Component <Props, { proposal: LiquidDecisions.Proposal, result: ProposalTally}> {

    private resolver: ProposalResolver

	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {},
            result: {
                yes: 0,
                no: 0,
                lost: 0,
            }
        }
        this.resolver = new ProposalResolver(props.proposal.id)
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    } 

    componentDidMount() {
        this.getResult()
    }

    public async getResult() {
        let result: ProposalTally = await this.resolver.calculateResult()
        this.setState({result: result})
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div></div>
        } 
        else {
            return (

                <Paper className="proposalResult">
                    {this.state.result.yes},{this.state.result.no},{this.state.result.lost}  
                </Paper>
            )
        }
    }

}