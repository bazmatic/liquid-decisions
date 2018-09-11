import * as React from 'react';
import {Proposal} from '../modules/LiquidDecisions'
import { Button, Card, Typography, IconButton } from '@material-ui/core'
import {HowToVote} from '@material-ui/icons'
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';

type Props = {
    proposal: Proposal,
    onSelect: Function | undefined
}

const MS_DAY: number = 60000 * 60 * 24

export default class ProposalLineComponent extends React.Component <Props, { proposal: Proposal }> {

    data: Proposal

	constructor(props) {
        super(props);
    
		this.state = {
            proposal: props.proposal || {},
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    private onSelect() {
        this.props.onSelect(this.state.proposal)
    }

    private getSubtitle() {
        //debugger
        let now = new Date().getTime()
        let expiresInDays = Math.round(((Number(this.state.proposal.expiryDate) * 1000) - now) / MS_DAY)
        return `Due in ${expiresInDays} days`
    }

    public render(): React.ReactNode {

        if (!this.state.proposal) {
            return <div className="proposalLine"></div>
            
        } 
        else {
            return (
                <Card>
                    <CardHeader
                        title={this.state.proposal.title}
                        subheader={this.getSubtitle()}
                    />
                    <CardContent>
                        <Typography>
                            <a href={this.state.proposal.uri}>More info</a>
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <Button fullWidth={true} onClick={this.onSelect.bind(this)} variant="outlined" color="secondary"> <HowToVote /> Vote</Button>
                    </CardActions>              
               </Card>
            )
        }
    }

}