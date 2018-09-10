import * as React from 'react';
import './App.css';
import { DelegateeEdit } from './DelegateeEditComponent'
import { DelegateeList } from './DelegateeListComponent'
import { ProposalList } from './ProposalListComponent'
import { ProposalNew } from './ProposalNewComponent'
import { ProposalVote } from './ProposalVoteComponent'
import { ProposalResolver } from '../modules/ProposalResolver'
import { Proposal, Delegatee, Contract } from '../modules/LiquidDecisions'
import AppBar from '@material-ui/core/AppBar'
//import Toolbar from '@material-ui/core/Toolbar'
//import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

//import { threadAddress } from './contracts/thread.js';
var ContractBuild = require('../../../ethereum/build/contracts/LiquidDecisions.json')
const threadAbi = ContractBuild.abi;

const APP_ADDRESS = '2oiLnkv2D1Pd5YBpW1TeDCLn68WazCsoTPn'
//const CONTRACT_ADDRESS = '0xfe6197115746cbb352cfffab1b4a646b6c3ef0d1';// '0x7ad8652e160c13bd849a7cf671106150884be92f';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import * as themeColors from '@material-ui/core/colors'

const Pages = {
	HomePage: 'HomePage',
	ProposalListPage: 'ProposalListPage',
	ProposalNewPage: 'ProposalNewPage',
	ProposalPage: 'ProposalPage',
	DelegateeListPage: 'DelegateeListPage',
	DelegateePage: 'DelegateePage',
}

//--------

type AppState = {
    page: string,
    proposals: Proposal[],
	delegatees: Delegatee[],
	currentProposal?: Proposal
}

export class App extends React.Component <{}, AppState> {

	private pageLookup: any

	constructor(props, context) {
		super(props, context);
		this.state = {
			//page: Pages.ProposalListPage,
			page: Pages.ProposalNewPage,
            proposals: [],
            delegatees: []
		}
		this.pageLookup = {}
		this.pageLookup[Pages.ProposalListPage] = this.proposalListPage.bind(this)
		this.pageLookup[Pages.ProposalNewPage] = this.proposalNewPage.bind(this)
		this.pageLookup[Pages.DelegateeListPage] = this.delegateeListPage.bind(this)
		this.pageLookup[Pages.DelegateePage] = this.delegateePage.bind(this)
		this.pageLookup[Pages.ProposalPage] = this.proposalPage.bind(this)
	}

	async componentDidMount() {	
		this.syncWithContract()
    }
    
    private async syncWithContract() {
		let delegatees = await Contract.getDelegatees()
		let proposals = await Contract.getProposals()
        this.setState({delegatees, proposals}) 
	}
	
	private getTheme() {
		return createMuiTheme({
			palette: {
			  secondary: {
				light: '#CCC',
				main: '#000',
				dark: themeColors.blue["50"],
				contrastText: 'red',
			  },
			  primary: {
				light: '#ff7961',
				main: '#fff',
				dark: '#555',
				contrastText: '#CCC',
			  },
			},
		});
	}

	homePage() {
		return this.proposalListPage()
	}

	proposalPage() {
		return (
			<div className="page">
                <ProposalVote delegatees={this.state.delegatees} proposal={this.state.currentProposal} />					
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
				<ProposalNew onSave={this.choosePage.bind(this, Pages.HomePage)}></ProposalNew>
			</div>
		)
	}

	delegateeListPage() {
		return (
			<div className="page">
     			<DelegateeList onSelect={this.onSelectProposal.bind(this)} delegatees={this.state.delegatees} />           				
			</div>
		)
	}

	delegateePage() {
		return (
			<div className="page">
                <DelegateeEdit onSave={this.choosePage.bind(this, Pages.HomePage)}  />					
			</div>
		)
	}

	onChangeTab(event, value) {
		this.choosePage(value)
	}
    
	choosePage(pageId) {
		console.log("Choosing page", pageId)

		if (Pages[pageId] && this.pageLookup[pageId]) {
			this.setState({page: pageId})
		}
		else {
			console.warn("Unknown page", pageId)
		}
    }
    
    onSelectProposal(currentProposal: Proposal) {
		console.log('Selected proposal', currentProposal)
		this.setState({currentProposal})
		this.choosePage(Pages.ProposalPage)
    }
	
	render() {

		let content = ""
		try {
			content = this.pageLookup[this.state.page]()
		}
		catch(e) {
			console.error(`No page content found. Selected page: {$this.state.page}`)
		}
		const theme = this.getTheme()
		
		return (
	
			<div className="App">
				<MuiThemeProvider theme={theme}>
					<AppBar position="static">
						<Tabs
							value={this.state.page}
							onChange={this.onChangeTab.bind(this)}
							indicatorColor="secondary"
							textColor="secondary"
							scrollable
							scrollButtons="auto"
						>						
							<Tab value={Pages.ProposalNewPage} label="New Proposal" />
							<Tab value={Pages.DelegateeListPage} label="Delegatees" />
							<Tab value={Pages.DelegateePage} label="Delegatee" />
							<Tab value={Pages.ProposalListPage} label="Proposals" />
						</Tabs>
					</AppBar>
				{content}
				</MuiThemeProvider>
			</div>
		)
	}
}


export default App;
