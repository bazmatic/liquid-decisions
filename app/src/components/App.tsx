import * as React from 'react';
import './App.css';
import { ProposalList } from './ProposalListComponent'
import { ProposalNew } from './ProposalNewComponent'
import { ProposalResolver } from '../modules/ProposalResolver'
import { Proposal, Delegatee, Contract } from '../modules/LiquidDecisions'

//import { threadAddress } from './contracts/thread.js';
var ContractBuild = require('../../../ethereum/build/contracts/LiquidDecisions.json')
const threadAbi = ContractBuild.abi;

const APP_ADDRESS = '2oiLnkv2D1Pd5YBpW1TeDCLn68WazCsoTPn'
//const CONTRACT_ADDRESS = '0xfe6197115746cbb352cfffab1b4a646b6c3ef0d1';// '0x7ad8652e160c13bd849a7cf671106150884be92f';

const Pages = {
	HomePage: 'HomePage',
	ProposalListPage: 'ProposePage',
	ProposalNewPage: 'ProposalNewPage'
}

//--------

type AppState = {
    page: string,
    proposals: Proposal[],
    delegatees: Delegatee[]
}

export class App extends React.Component <{}, AppState> {
	constructor(props, context) {
		super(props, context);
		this.state = {
			page: Pages.ProposalListPage,
			//page: Pages.ProposalNewPage,
            proposals: [],
            delegatees: []
        }
	}

	async componentDidMount() {	
		this.syncWithContract()
    }
    
    private async syncWithContract() {
		let delegatees = await Contract.getDelegatees()
		let proposals = await Contract.getProposals()
        this.setState({delegatees, proposals}) 
    }

	homePage() {
		return (
			<div className="page">
			</div>
		) 
	}

	proposalListPage() {
		return (
			<div className="page">
                <ProposalList onSelect={this.onSelectProposal.bind(this)} delegatees={this.state.delegatees} proposals={this.state.proposals} />					
			</div>
		)
	}
	proposalNewPage() {
		return (
			<div className="page">
				New proposal
				<ProposalNew></ProposalNew>
			</div>
		)
	}
    
	choosePage(pageId) {
		console.log("Choosing page", pageId)
		if (Pages[pageId]) {
			console.log('Set state', {page: pageId})
			console.log('Current page state', this.state.page)
			this.setState({page: pageId})
		}
		else {
			console.warn("Unknown page", pageId)
		}
    }
    
    onSelectProposal(proposal: Proposal) {
        console.log('Selected proposal', proposal)
    }
	
	render() {
		let content
		console.log("App.render()", this.state)

        if (this.state.page == Pages.ProposalListPage) {
            content = this.proposalListPage()
		}
		else if (this.state.page == Pages.ProposalNewPage)
		{
            content = this.proposalNewPage()
		}
		else 
		{
            content = this.homePage()
        }

		return (	
			<div className="App">
				{content}
			</div>
		)
	}
}


export default App;
