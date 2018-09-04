import * as React from 'react';
import './App.css';
import { ProposalList } from './ProposalListComponent'
import { ProposalResolver } from '../modules/ProposalResolver'
import { Proposal, Delegatee, Contract } from '../modules/LiquidDecisions'

//const IpfsAPI = require('./lib/ipfs-api/dist/index.js');
const IpfsAPI = require('ipfs-api')

//import { threadAddress } from './contracts/thread.js';
var ContractBuild = require('./contracts/LiquidDecisions.json')
const threadAbi = ContractBuild.abi;

const APP_ADDRESS = '2oiLnkv2D1Pd5YBpW1TeDCLn68WazCsoTPn'
//const CONTRACT_ADDRESS = '0xfe6197115746cbb352cfffab1b4a646b6c3ef0d1';// '0x7ad8652e160c13bd849a7cf671106150884be92f';

const Pages = {	HomePage: 'HomePage', ProposalListPage: 'ProposePage'}

//--------

type AppState = {
    page: string,
    proposals: Proposal[],
    delegatees: Delegatee[]
}

class App extends React.Component <{}, AppState> {
	constructor(props, context) {
		super(props, context);
		this.state = {
            page: Pages.ProposalListPage,
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

	proposalsListPage() {
		return (
			<div className="page">
                <ProposalList onSelect={this.onSelectProposal.bind(this)} delegatees={this.state.delegatees} proposals={this.state.proposals} />					
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
            content = this.proposalsListPage()
        }
        else {
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
