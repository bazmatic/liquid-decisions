import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { DelegateeSelectorComponent } from './DelegateeSelectorComponent'
import { Card, CardContent, CardHeader, Typography, CardActions, Button, Grid } from '@material-ui/core';
import { DelegateeList } from './DelegateeListComponent';
import { ProposalResult } from './ProposalResult';
import { ProposalTally } from '../modules/ProposalResolver';

const MS_HOUR: number = 60000 * 60
const MS_DAY: number = MS_HOUR * 24

type Props = {
    proposal: LiquidDecisions.Proposal,
    delegatees: LiquidDecisions.Delegatee[]
}

export class ProposalVote extends React.Component <Props, { showResults: boolean, proposal: LiquidDecisions.Proposal, delegatees?: LiquidDecisions.Delegatee[], selectedDelegatee?: LiquidDecisions.Delegatee }> {

    //private proposalResultComponent: ProposalResult
	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {},
            delegatees: props.delegatees || [],
            selectedDelegatee: undefined,
            showResults: false
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
        return -1
        let now = new Date().getTime()
        return (Number(this.state.proposal.expiryDate) * 1000) - now 
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div className="stitch"></div>
        } 
        else {
            let delegationContent, actionContent, resultContent, message
            if (this.getExpiry() > 0) {
                 message = 'This proposal is still open for voting.'
                 actionContent = this.renderOpenActions()           
            }
            else {
                message = 'Voting has closed for this proposal.'
                actionContent = this.renderClosedActions()
                if (this.state.showResults) {
                    resultContent = <ProposalResult proposal={this.state.proposal} />
                }
            }

            return (
                
                <Card className="proposal">
                    <CardHeader
                        title={this.state.proposal.title}
                        subheader={this.getSubtitle()}
                    />
                    <CardContent>
                        <Typography>
                            {message}
                        </Typography>
                        
                        <Typography>                  
                            <a href={this.state.proposal.uri}>More info</a>
                        </Typography>

                        {resultContent}
  
                    </CardContent>
                    {actionContent}              
                </Card>
            )
        }
    }

    private renderOpenActions(): React.ReactNode {
        if (this.state.selectedDelegatee === undefined) {
            return (
                <CardActions>  
                    <Grid container direction="row">    
                        <Grid item xs={6}>           
                            <Button fullWidth={true}onClick={this.vote.bind(this, false)} variant="outlined" color="secondary">Vote YES</Button>
                        </Grid>
                        <Grid item xs={6}>
                            <Button fullWidth={true}onClick={this.vote.bind(this, false)} variant="outlined" color="secondary">Vote NO</Button>
                        </Grid>
                        <Grid item xs={12}>
                            <DelegateeList delegatees={this.state.delegatees} selector={true} onSelect={this.onSelectDelegatee.bind(this)} />
                        </Grid>
                    </Grid>

                </CardActions>  
            )
        }
        else {
            return (
                <CardActions>                     
                    <Button fullWidth={true}onClick={this.delegateVote.bind(this, false)} variant="outlined" color="secondary">Delegate to {this.state.selectedDelegatee.name}</Button>
                    <Button fullWidth={true}onClick={this.cancelDelegation.bind(this, false)} variant="outlined" color="secondary">Cancel Delegation</Button>
                </CardActions>  
            )
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