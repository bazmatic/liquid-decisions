import * as React from 'react'
import { TextField, Button, Paper, Grid } from '@material-ui/core'

type Props = {
    uport: any;
    credentials: any;
    onCredentials: Function;
}

type State = {
    loading: boolean
}

export class UportLoginButton extends React.Component <Props, State> {

    private uport: any
    private credentials: any
	constructor(props) {
		super(props)
		this.uport = props.uport
        this.credentials = props.credentials
        this.state = {
            loading: false
        }
	}
	private async onClick() {
        // Request credentials to login
        this.setState({loading: true})
        try {
            this.credentials = await this.uport.requestCredentials({
                requested: ['name', 'country', 'address'],
                notifications: true // We want this if we want to recieve credentials
            });
            console.log(this.credentials);
            this.props.onCredentials(this.credentials);
        }
        catch (e) {
            console.error(e)
        }
        this.setState({loading: false})		
    }

    /*private async onClick() {
        // Request credentials to login
        this.setState({loading: true})
        try {
            this.uport.requestDisclosure({
                requested: ['name', 'country', 'address'],
                notifications: true // We want this if we want to receive credentials
            });
            this.uport.onResponse('dislosureReq').then(res => {
                console.log(res);
                this.props.onCredentials(res);
            })
            
        }
        catch (e) {
            console.error(e)
        }
        this.setState({loading: false})		
    }*/
    
    public render(): React.ReactNode {
        return (
            <Button fullWidth={true} onClick={this.onClick.bind(this)} disabled={this.state.loading} variant="outlined" color="secondary">Sign in with uPort</Button>
        )
    }
}  