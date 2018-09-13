import * as React from 'react'
import  { Delegatee } from '../modules/LiquidDecisions'
import { Typography, Grid, Paper, Card, CardHeader, CardContent, CardActions, Button } from '@material-ui/core';
//im//port './ThreadViewer.css';

type Props = {
    delegatees: Delegatee[],
    onSelect?: Function,
    selector?: boolean,
}

export class DelegateeList extends React.Component <Props, { delegatees: Delegatee[] }> {
    
    private onSelect: Function
    
    constructor(props) {
		super(props);
        this.state = props;
        this.onSelect = props.onSelect ||  (()=>{})
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    public selectItem(delegatee: Delegatee) {
        this.props.onSelect(delegatee)
    }

    render() {

        let delegatees: any[] = this.state.delegatees.map((delegateeData: Delegatee)=>{
            let cardActions = null
            if (this.props.selector !== undefined) {
                cardActions = (
                    <CardActions>
                        <Button onClick={this.selectItem.bind(this, delegateeData)} color="secondary">Choose</Button>
                    </CardActions>
                )
            }

            return (               
                <Grid item key={delegateeData.addr}>
                    <Card>
                        <CardHeader title={delegateeData.name} subheader={delegateeData.addr} />
                        <CardContent>
                            <Typography variant="body1">
                                Here is some information about this Delegatee
                            </Typography>
                        </CardContent>
                        {cardActions}
                    </Card>
                </Grid>
            )
        });  
        console.log(delegatees) 
              
		return (
			<div className="delegateeList"> 
                <Grid container direction="column">              
                    {delegatees}
                </Grid>
			</div>
		);
    }

	handleError(err) {
		console.error(err);
	}
}
