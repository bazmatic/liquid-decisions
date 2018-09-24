import * as React from 'react'
import  { Delegatee } from '../modules/LiquidDecisions'
import { Typography, Grid, Paper, Card, CardHeader, CardContent, CardActions, Button, CardMedia, CardActionArea, Avatar } from '@material-ui/core';

//im//port './ThreadViewer.css';

const DEFAULT_PROFILE_IMAGE='https://everydaylivesinwar.herts.ac.uk/wp-content/plugins/staff-list/images/staff-member-1.jpg'

type Props = {
    delegatee: Delegatee
    ipfsApi: any
    selector: boolean
    onSelect?: Function
}

type State = {
    delegatee?: Delegatee
    ipfsApi?: any
}

export class DelegateeCard extends React.Component <Props, State> {
    
    onSelect: Function
    delegatee: Delegatee

    constructor(props) {
        super(props);
        this.state = {
            delegatee: props.delegatee,
            ipfsApi: props.ipfsApi,
        }
        this.delegatee = props.delegatee
        this.onSelect = props.onSelect || (()=>{})
    }

    componentDidMount() {
        debugger
        if (this.state.delegatee.imageUrl.indexOf('ipfs') > -1) {
            debugger
            let ipfsHash = this.state.delegatee.imageUrl.replace('https://gateway.ipfs.io/ipfs/', '')
            this.state.ipfsApi.files.get(ipfsHash, {}, (err, data) => {
                var result = data[0].content.reduce(function (data, byte) {
                    return data + String.fromCharCode(byte);
                }, '');

                //result = JSON.parse(result);
                this.delegatee.imageUrl = result
                this.setState({delegatee: this.delegatee})


            })
        }
        
    }

    render() {
        let cardActions = null
        if (this.props.selector) {
            cardActions = (
                <CardActions>
                    <Button onClick={this.select.bind(this, this.delegatee)} color="secondary">Choose</Button>
                </CardActions>
            )
        }

        return (            
            <Card>
                <CardHeader title={this.state.delegatee.name} subheader={this.state.delegatee.addr} />
            
                <CardContent>
                    <Grid container direction="row">
                        <Grid item xs={3}>
                            <Avatar src={this.state.delegatee.imageUrl} title={this.state.delegatee.name} />
                        </Grid>
                        <Grid item xs={9}>
                            <Typography variant="body1">
                                Background information: <a href={this.state.delegatee.backgroundUrl}>{this.state.delegatee.backgroundUrl}</a>
                            </Typography>
                        </Grid>
                    </Grid>
                    

                </CardContent>
                {cardActions}

            </Card>
        )
    }

    select(item) {
        this.props.onSelect(this.delegatee)
    }

	handleError(err) {
		console.error(err);
	}
}
