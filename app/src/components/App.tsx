import * as React from 'react'
import { decode as mnidDecode } from 'mnid'
import IpfsAPI from 'ipfs-api'

import './App.css';
import { DelegateeEdit } from './DelegateeEditComponent'
import { DelegateeList } from './DelegateeListComponent'
import { ProposalList } from './ProposalListComponent'
import { ProposalNew } from './ProposalNewComponent'
import { ProposalComponent } from './ProposalComponent'
import { Proposal, Delegatee, Contract, uport } from '../modules/LiquidDecisions'

import AppBar from '@material-ui/core/AppBar'
//import Toolbar from '@material-ui/core/Toolbar'
//import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

var ContractBuild = require('../../../ethereum/build/contracts/LiquidDecisions.json')
//const threadAbi = ContractBuild.abi;
//const APP_ADDRESS = '2oiLnkv2D1Pd5YBpW1TeDCLn68WazCsoTPn'

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import * as themeColors from '@material-ui/core/colors'
import { Typography, Paper } from '@material-ui/core';
import { UportLoginButton } from './UportLoginButton';


const Pages = {
	//SignInPage: 'SignInPage',
	//HomePage: 'HomePage',
	ProposalListPage: 'ProposalListPage',
	ProposalNewPage: 'ProposalNewPage',
	ProposalPage: 'ProposalPage',
	DelegateeListPage: 'DelegateeListPage',
	DelegateePage: 'DelegateePage',
}

const HomePage = Pages.ProposalListPage

//--------

type AppState = {
	uportCredentials?: any;
	ethereumAddress?: string;
	selectedTab: string;
    page: string;
    proposals: Proposal[];
	delegatees: Delegatee[];
	currentProposal?: Proposal;
}

type User = {
	uportCredentials: any;
	ethereumAddress: string;
}

export class App extends React.Component <{}, AppState> {

	private pageLookup: any
	private ipfsApi: any

	constructor(props, context) {
		super(props, context)
		this.state = {
			ethereumAddress: undefined,
			uportCredentials: undefined,
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
		this.ipfsApi = IpfsAPI('ipfs.infura.io', 5001, {protocol: 'https'});
		/*
		this.pageLookup[Pages.SignInPage] = {
			content: this.signInPage.bind(this),
			menu: undefined
		}*/
	}

	async componentDidMount() {	
		await this.loadState()
		//this.choosePage(HomePage)
		this.syncWithContract()
		
    }
    
    private async syncWithContract() {
		let delegatees = (await Contract.getDelegatees())
			//TODO: Find out why uPort is apparently adding single quotes
			.map((item: Delegatee)=>{
				item.name = item.name.replace(/'/g, "")
				item.backgroundUrl = item.backgroundUrl.replace(/'/g, "")
				item.imageUrl = item.imageUrl.replace(/'/g, "")
				return item
			}
		)
		let proposals = await Contract.getProposals()
        this.setState({delegatees, proposals}) 
	}
	

	private getTheme() {
		return createMuiTheme({
			palette: {
			  secondary: {
				light: '#CCC',
				main: themeColors.blue["800"],
				dark: themeColors.blue["800"],
				contrastText: 'red',
			  },
			  primary: {
				light: '#ff7961',
				main: '#fff',
				dark: themeColors.blue["50"],
				contrastText: '#CCC',
			  },
			},
			overrides: {
				MuiPaper: {
					root: {
						padding: "1em",
					}
				},
				MuiButton: {
					root: {
						marginRight: "1em"
					}
				}
			}
		});
	}

	signInPage() {
		return (
			<div className="page">
				<Paper>
					<Typography variant="headline">Sign In</Typography>
					<UportLoginButton uport={uport} credentials={this.state.uportCredentials} onCredentials={(creds)=>this.onUportCredentials(creds)}/>

				</Paper>
			</div>
		)		
	}
	proposalPage() {
		if (this.state.currentProposal !== undefined) {
			return (
				<div className="page">
					<Paper>
						<Typography variant="headline">Proposal</Typography>
					</Paper>
					<ProposalComponent ipfsApi={this.ipfsApi} showVoteUi={true} showSelectUi={false} delegatees={this.state.delegatees} proposal={this.state.currentProposal} />					
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
				<Paper>
					<Typography variant="headline">Current Proposals</Typography>
				</Paper>
                <ProposalList ipfsApi={this.ipfsApi} onSelect={this.onSelectProposal.bind(this)} delegatees={this.state.delegatees} proposals={this.state.proposals} />					
			</div>
		)
	}

	proposalNewPage() {
		return (
			<div className="page">
				<Paper>
					<ProposalNew onSave={this.choosePage.bind(this, HomePage)}></ProposalNew>
				</Paper>
			</div>
		)
	}

	delegateeListPage() {
		return (
			<div className="page">
				<Paper>
					<Typography variant="headline">Registered Delegates</Typography>
				</Paper>
     			<DelegateeList selector={false} ipfsApi={this.ipfsApi} delegatees={this.state.delegatees} />           				
			</div>
		)
	}

	delegateePage() {
		//Get delegate that matches my address
		let delegatee = this.state.delegatees.find((item: Delegatee )=>{
			return item.addr.toLowerCase() === this.state.ethereumAddress.toLowerCase()
		})
		return (
			<div className="page">
				<Paper>
					<Typography variant="headline">Register as a Delegate</Typography>
				</Paper>
                <DelegateeEdit delegatee={delegatee} onSave={this.choosePage.bind(this, HomePage)}  />					
			</div>
		)
	}

	onChangeTab(event, value) {
		this.choosePage(value)
	}
    
	async choosePage(pageId) {
		console.log("Choosing page", pageId)
		if (Pages[pageId] && this.pageLookup[pageId]) {
			await this.setState({page: pageId, selectedTab: this.pageLookup[pageId].tab || pageId})
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



	onUportCredentials(uportCredentials: any) {
		this.setState({
			uportCredentials,
			ethereumAddress: mnidDecode(uportCredentials.address).address.toLowerCase(),
		}, 
		()=>{
			console.log('Got ethereum address', this.state.ethereumAddress);
			this.saveState()
			this.choosePage(HomePage)
		});

	}
	
	saveState() {
		let stateCopy = JSON.parse(JSON.stringify(this.state));
		const serialisedState = JSON.stringify(stateCopy);
		localStorage.setItem('state', serialisedState);
	}

	async loadState(): Promise<any> {

		return new Promise((resolve, reject) => {
			try {
				const serialisedState = localStorage.getItem('state');
				if (serialisedState !== null) {
					let unserialisedState = JSON.parse(serialisedState);
					this.setState(unserialisedState, ()=>{
						resolve();
					});
				}
			}
			catch(err) {
				reject(err);
			}
		})
		
	
	}

	user(): User {
		if (this.state.uportCredentials) {
			return {
				uportCredentials: this.state.uportCredentials,
				ethereumAddress: this.state.ethereumAddress
			}
		}
		else {
			return null
		}
	}

	getPageContent() {
		return this.pageLookup[this.state.page].content()
	}
	
	render() {

		const theme = this.getTheme()

		if (!this.user() || !this.state.page) {
			let content = this.signInPage()
			return (
				<div className="App">
					<MuiThemeProvider theme={theme}>
						{content}
					</MuiThemeProvider>
				</div>
			)
		}
		else {
			let content = ""
			try {
				content = this.getPageContent()
			}
			catch(e) {
				console.error(`No page content found. Selected page: {$this.state.page}`)
			}

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
								<Tab value={Pages.ProposalListPage} label="Proposals" />						
								<Tab value={Pages.ProposalPage} label="Propose" />
								<Tab value={Pages.DelegateeListPage} label="Delegates" />
								<Tab value={Pages.DelegateePage} label="Register" />					
							</Tabs>
							<Typography variant="subheading" align="right">{this.user().uportCredentials.name}</Typography>	
							
						</AppBar>
					{content}
					</MuiThemeProvider>
				</div>
			)
		}

	}


		
}


export default App;
