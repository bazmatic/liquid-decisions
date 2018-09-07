import * as React from 'react'
import ProposalLineComponent from './ProposalLineComponent'
import { Proposal, Delegatee } from '../modules/LiquidDecisions'
//im//port './ThreadViewer.css';

type Props = {
    proposals: Proposal[],
    delegatees: Delegatee[],
    onSelect: Function
}

export class ProposalList extends React.Component <Props, { proposals: Proposal[], delegatees: Delegatee[] }> {
    
	constructor(props) {
		super(props);
		this.state = props;
    }

    componentWillReceiveProps(newProps) {
        console.log('ProposalList.componentWillReceiveProps():', newProps);
        this.setState(newProps);
    }

    public selectItem(proposal: Proposal) {
        this.props.onSelect(proposal)
    }

    render() {
        let proposals: any[];
        var number = 0;
        console.log('ProposalList.render():', this.state);

        proposals = this.state.proposals.map((proposalData: Proposal)=>{
            number ++;
            return <ProposalLineComponent onSelect={this.selectItem.bind(this, proposalData)} proposal={proposalData} />
        });   
        console.log(proposals.length, "proposals");  
                     
		return (
			<div className="ProposalList">
                {proposals.length} proposals
                {proposals}
			</div>
		);
    }

	handleError(err) {
		console.error(err);
	}
}
