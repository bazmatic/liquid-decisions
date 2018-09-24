import * as React from 'react'
import  { Delegatee } from '../modules/LiquidDecisions'
import { Typography, Grid, Paper, Card, CardHeader, CardContent, CardActions, Button, CardMedia, CardActionArea, Avatar } from '@material-ui/core';
import { DelegateeCard } from './DelegateeCardComponent';

//im//port './ThreadViewer.css';

const DEFAULT_PROFILE_IMAGE='https://everydaylivesinwar.herts.ac.uk/wp-content/plugins/staff-list/images/staff-member-1.jpg'

type Props = {
    delegatees: Delegatee[],
    onSelect?: Function,
    selector?: boolean,
    ipfsApi?: any
}

export class DelegateeList extends React.Component <Props, { delegatees: Delegatee[] }> {
    
    private onSelect: Function
    private ipfsApi: any
    private selector: boolean

    constructor(props) {
		super(props);
        this.state = props;
        this.selector = props.selector || false
        this.onSelect = props.onSelect ||  (()=>{})
        this.ipfsApi = props.ipfsApi
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

            const imageUrl = ((delegateeData.imageUrl == '' || !delegateeData.imageUrl || delegateeData.imageUrl == 'image')?DEFAULT_PROFILE_IMAGE:delegateeData.imageUrl)
            return (                 
                <Grid item key={delegateeData.addr}>
                    <DelegateeCard selector={this.selector} ipfsApi={this.ipfsApi} delegatee={delegateeData} onSelect={this.onSelect}>
                    </DelegateeCard>
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
