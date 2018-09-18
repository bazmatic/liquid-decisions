import * as React from 'react'
import { TextField, Button, Paper, Grid } from '@material-ui/core'

type Props = {
    uport: any;
    credentials: any;
    onCredentials: Function;
}

type State = {

}

export class UportLoginButton extends React.Component <Props, State> {

    private uport: any
    private credentials: any
	constructor(props) {
		super(props)
		this.uport = props.uport
        this.credentials = props.credentials
        this.state = {}
	}
	private async onClick() {
        debugger
		// Request credentials to login
		this.credentials = await this.uport.requestCredentials({
			requested: ['name', 'country', 'address'],
			notifications: true // We want this if we want to recieve credentials
		});
		this.props.onCredentials(this.credentials);
    }
    
    public render(): React.ReactNode {
        return (
            <Button fullWidth={true} onClick={this.onClick.bind(this)} variant="outlined" color="secondary">Sign in with uPort</Button>
        )
    }
}  