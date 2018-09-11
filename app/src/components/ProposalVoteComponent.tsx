import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { DelegateeSelectorComponent } from './DelegateeSelectorComponent'
import { Card, CardContent, CardHeader, Typography, CardActions, Button, Grid } from '@material-ui/core';
import { DelegateeList } from './DelegateeListComponent';

const MS_DAY: number = 60000 * 60 * 24

type Props = {
    proposal: LiquidDecisions.Proposal,
    delegatees: LiquidDecisions.Delegatee[]
}

export class ProposalVote extends React.Component <Props, { proposal: LiquidDecisions.Proposal, delegatees?: LiquidDecisions.Delegatee[], selectedDelegatee?: LiquidDecisions.Delegatee }> {

	constructor(props) {
		super(props);
		this.state = {
            proposal: props.proposal || {},
            delegatees: props.delegatees || [],
            selectedDelegatee: undefined
        }
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
        let now = new Date().getTime()
        let expiresInDays = Math.round(((Number(this.state.proposal.expiryDate) * 1000) - now) / MS_DAY)
        return `Due in ${expiresInDays} days`
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div className="stitch"></div>
        } 
        else {
            let delegationContent, actionContent
            if (this.state.selectedDelegatee === undefined) {
                actionContent = (
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
                actionContent = (
                    <CardActions>                     
                        <Button fullWidth={true}onClick={this.delegateVote.bind(this, false)} variant="outlined" color="secondary">Delegate to {this.state.selectedDelegatee.name}</Button>
                        <Button fullWidth={true}onClick={this.cancelDelegation.bind(this, false)} variant="outlined" color="secondary">Cancel Delegation</Button>
                    </CardActions>  
                )
            }
            return (
                
                <Card className="proposal">
                    <CardHeader
                        title={this.state.proposal.title}
                        subheader={this.getSubtitle()}
                    />
                    <CardContent>
                        <Typography>
                            <a href={this.state.proposal.uri}>More info</a>
                        </Typography>
                    </CardContent>
                    {actionContent}              
                </Card>
            )
        }
    }

}