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

const HomePage = Pages.ProposalListPage

//--------

type AppState = {
	selectedTab: string,
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
			selectedTab: HomePage,
			page: HomePage,
            proposals: [],
            delegatees: [],
		}
		this.pageLookup = {}
		this.pageLookup[Pages.ProposalListPage] = {
			content: this.proposalListPage.bind(this),
		}
		this.pageLookup[Pages.DelegateeListPage] = {
			content: this.delegateeListPage.bind(this),
		} 
		this.pageLookup[Pages.DelegateePage] = {
			content: this.delegateePage.bind(this),
		}
		this.pageLookup[Pages.ProposalPage] = {
			content: this.proposalPage.bind(this)
		}
		this.pageLookup[Pages.ProposalNewPage] = {
			content: this.proposalNewPage.bind(this),
			menu: Pages.ProposalPage,
		}
	}

	async componentDidMount() {	
		this.choosePage(HomePage)
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
			overrides: {
				MuiPaper: {
					root: {
						padding: "1em",
					}
				},
			}
		});
	}


	proposalPage() {
		debugger
		if (this.state.currentProposal !== undefined) {
			return (
				<div className="page">
					<ProposalVote delegatees={this.state.delegatees} proposal={this.state.currentProposal} />					
				</div>
			)
		}
		else {
			return this.proposalNewPage()
		}
		
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
				<ProposalNew onSave={this.choosePage.bind(this, HomePage)}></ProposalNew>
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
                <DelegateeEdit onSave={this.choosePage.bind(this, HomePage)}  />					
			</div>
		)
	}

	onChangeTab(event, value) {
		this.choosePage(value)
	}
    
	choosePage(pageId) {
		console.log("Choosing page", pageId)
		if (Pages[pageId] && this.pageLookup[pageId]) {
			this.setState({page: pageId, selectedTab: this.pageLookup[pageId].tab || pageId})
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
			content = this.pageLookup[this.state.page].content()
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
							value={this.state.selectedTab}
							onChange={this.onChangeTab.bind(this)}
							indicatorColor="secondary"
							textColor="secondary"
							scrollable
							scrollButtons="auto"
						>						
							<Tab value={Pages.ProposalPage} label="Proposal" />
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
