import * as React from 'react';
import { Grid, TextField, Button, Paper } from '@material-ui/core'
import * as LiquidDecisions from '../modules/LiquidDecisions'


type Props = {
    onSave: Function | undefined
    //onCancel: Function | undefined
}

export class DelegateeEdit extends React.Component <Props, any> {
    key: string

	constructor(props) {
		super(props);
		this.state = {
            name: '',
            email: '',     
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    handleChange(event: any) {
        //this.setState({value: event.target.value})
        let stateUpdate = {}
        stateUpdate[event.target.name] = event.target.value
        this.setState(stateUpdate)
    }

    async save() {
        let result = await LiquidDecisions.Contract.registerDelegatee(this.state.name)
        console.log("Sent delegatee:", result)
        if (this.props.onSave !== undefined) {
            this.props.onSave(result)
        }
    }

    public render(): React.ReactNode {
        return (
            <Paper>
                <Grid
                container
                direction="row"
                alignItems="stretch"
                spacing={24}
                >
                    <Grid item xs={12}>
                        <TextField label="Your name" type="text" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} fullWidth={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Your email" name="email" value={this.state.uri} onChange={this.handleChange.bind(this)} fullWidth={true} />
                    </Grid>
                        
                    <Grid item xs={6}>
                        <Button fullWidth={true} onClick={this.save.bind(this)} variant="outlined" color="secondary">Save</Button>
                    </Grid>
                    <Grid item xs={6}>
                        <Button fullWidth={true} onClick={this.save.bind(this)} variant="outlined" color="secondary">Cancel</Button>
                    </Grid>
                </Grid>
            </Paper>
        )
    }
}