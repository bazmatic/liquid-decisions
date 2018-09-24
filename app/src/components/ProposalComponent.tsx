import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { Card, CardContent, CardHeader, Typography, CardActions, Button, Grid, Collapse, IconButton } from '@material-ui/core';
import { DelegateeList } from './DelegateeListComponent';
import { ProposalResult } from './ProposalResult';
import { HowToVote, ExpandMore } from '@material-ui/icons'

const MS_HOUR: number = 60000 * 60
const MS_DAY: number = MS_HOUR * 24

type Props = {
    proposal: LiquidDecisions.Proposal,
    delegatees: LiquidDecisions.Delegatee[],
    showVoteUi?: boolean
    showSelectUi?: boolean
    onSelect?: Function | undefined
}

type State = {
    showDelegationUi?: boolean
    showResults: boolean
    proposal: LiquidDecisions.Proposal
    delegatees?: LiquidDecisions.Delegatee[]
    selectedDelegatee?: LiquidDecisions.Delegatee
}

export class ProposalComponent extends React.Component <Props, State> {

    //private proposalResultComponent: ProposalResult
	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {},
            delegatees: props.delegatees || [],
            selectedDelegatee: undefined,
            showResults: true,
            showDelegationUi: false,
        }
        //this.proposalResultComponent = new ProposalResult({proposal: props.proposal})
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    } 

    private async vote(value: boolean) {
        let result = await LiquidDecisions.Contract.castVote(this.state.proposal.id, value)
    }

    private async delegateVote() {
        if (this.state.selectedDelegatee !== undefined) {
            let result = await LiquidDecisions.Contract.delegateVote(this.state.proposal.id, this.state.selectedDelegatee.addr)    
        }
        else {
            console.log('No selected delegatee')
        }
    }

    private cancelDelegation() {
        this.setState({selectedDelegatee: undefined})
    }

    private async onSelectDelegatee(selectedDelegatee: LiquidDecisions.Delegatee) {
        this.setState({selectedDelegatee})
    }

    private onSelect() {
        if (this.props.onSelect.constructor === Function ) {
            this.props.onSelect(this.state.proposal)
        }      
    }

    private toggleDelegationUi() {
        this.setState({showDelegationUi: !this.state.showDelegationUi})
    }

    private getSubtitle() {
        let expires = this.getExpiry()     
        if (expires > 0) {
            let expiresInDays = Math.floor(this.getExpiry() / MS_DAY)
            return `Closes in ${expiresInDays} days`
        }
        else if (expires < 0) {
            let expiredDays = Math.abs(Math.ceil(this.getExpiry() / MS_DAY))
            if (expiredDays == 0) {
                return `Closed less than a day ago`
            }
            else {
                return `Closed ${expiredDays} days ago`
            }           
        }
        else {
            let expiresInHours = Math.floor(this.getExpiry() / MS_HOUR)
            return `Closes in ${expiresInHours} hours`         
        }
        
    }

    private getExpiry(): number {
        //return -1
        let now = new Date().getTime()
        return (Number(this.state.proposal.expiryDate) * 1000) - now 
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return null
        } 
        else {
            let actionContent = this.renderActionContent()
            let resultContent = this.renderResultContent()

            return (
                
                <Card className="proposal">
                    <CardHeader
                        title={this.state.proposal.title}
                        subheader={this.getSubtitle()}
                    />
                    <CardContent>                  
                        <Typography component="div" gutterBottom>                  
                            <a href={this.state.proposal.uri}>More info</a>
                        </Typography>
                        {resultContent}  
                    </CardContent>
                    <CardActions>
                        {actionContent} 
                    </CardActions>             
                </Card>
            )
        }
    }

    private renderActionContent(): React.ReactNode {
        if (this.getExpiry() > 0) {

            return this.renderOpenActions()           
       }
       else {
           return this.renderClosedActions()

       }
    }

    private renderResultContent(): React.ReactNode {
        if (this.state.showResults) {
            return <ProposalResult proposal={this.state.proposal} />
        }
        else {
            return null
        } 
    }

    private renderOpenActions(): React.ReactNode {
        if (this.props.showVoteUi) {
            if (this.state.selectedDelegatee === undefined) {
                return (
                    <div className="voteUi">         
                        <Button onClick={this.vote.bind(this, true)} variant="outlined" color="secondary">Vote YES</Button>
                        <Button onClick={this.vote.bind(this, false)} variant="outlined" color="secondary">Vote NO</Button>
                        <IconButton
                            onClick={this.toggleDelegationUi.bind(this)}
                            aria-expanded={this.state.showDelegationUi}
                            aria-label="Show more"
                        >
                            <ExpandMore />
                        </IconButton>
                        <Collapse in={this.state.showDelegationUi} timeout="auto" unmountOnExit>
                            <CardContent>
                                <DelegateeList delegatees={this.state.delegatees} selector={true} onSelect={this.onSelectDelegatee.bind(this)} />
                            </CardContent>
                        </Collapse>
                    </div>         
                )
            }
            else {
                return (
                    <div className="confirmDelegationUi">     
                        <Typography variant="subheading">
                            You are about to delegate your vote on this proposal to {this.state.selectedDelegatee.name}
                        </Typography>
                        <Button onClick={this.delegateVote.bind(this, false)} variant="outlined" color="secondary">Delegate</Button>
                        <Button onClick={this.cancelDelegation.bind(this, false)} color="secondary">Cancel</Button>
                    </div>

                )
            }
        }
        else if (this.props.showSelectUi) {
            return (
                <Grid container direction="row">  
                    <Button onClick={this.onSelect.bind(this)} color="secondary"> <HowToVote /> Vote</Button>
                </Grid>
            )  
        }
        else {
            return null
        }

    }

    private renderClosedActions(): React.ReactNode {

        return (
            <CardActions>                     
                <Button fullWidth={true}onClick={this.tallyResults.bind(this, false)} variant="outlined" color="secondary">Tally results</Button>
            </CardActions>  
        )
    }

    private tallyResults() {
       this.setState({showResults: true})
    }

}