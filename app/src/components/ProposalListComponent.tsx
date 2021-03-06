import * as React from 'react'
import { ProposalComponent } from './ProposalComponent'
import { Proposal, Delegatee } from '../modules/LiquidDecisions'
import { Paper, Typography, Grid } from '@material-ui/core';

type Props = {
    proposals: Proposal[],
    delegatees: Delegatee[],
    onSelect: Function,
    ipfsApi: any,
}

export class ProposalList extends React.Component <Props, { proposals: Proposal[], delegatees: Delegatee[] }> {
    
	constructor(props) {
		super(props);
		this.state = props;
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    public selectItem(proposal: Proposal) {
        this.props.onSelect(proposal)
    }

    render() {
        let proposals: any[];
        var number = 0;
        
        proposals = this.state.proposals.map((proposalData: Proposal)=>{
            number ++;
            return (
                <Grid item key={proposalData.id}>
                    <ProposalComponent ipfsApi={this.props.ipfsApi} showSelectUi={true} showVoteUi={false} onSelect={this.selectItem.bind(this, proposalData)} proposal={proposalData} delegatees={this.state.delegatees}/>
                </Grid>

            )
        });    
                     
		return (
			<div>
                <Grid container direction="column" spacing={16}>
                    {proposals}
                </Grid>
			</div>
		);
    }

	handleError(err) {
		console.error(err);
	}
}
