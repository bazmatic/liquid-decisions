import * as React from 'react';
import { Grid, TextField, Button, Paper } from '@material-ui/core'
import * as LiquidDecisions from '../modules/LiquidDecisions'


type Props = {
    onSave: Function | undefined
    delegatee: LiquidDecisions.Delegatee
    //onCancel: Function | undefined
}

type State = {
    delegatee: LiquidDecisions.Delegatee
}

export class DelegateeEdit extends React.Component <Props, State> {
    key: string
    delegatee: LiquidDecisions.Delegatee

	constructor(props) {
        super(props);
        this.delegatee = props.delegatee || {}
		this.state = {
            delegatee: this.delegatee
        }
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    handleChange(event: any) {
        //this.setState({value: event.target.value})
        let fieldName = event.target.name
        let fieldValue = event.target.value
        this.delegatee[fieldName] = fieldValue
        this.setState({delegatee: this.delegatee})
    }

    async save() {
        //debugger
        let result = await LiquidDecisions.Contract.registerDelegatee(this.state.delegatee)
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
                        <TextField label="Your name" type="text" name="name" value={this.state.delegatee.name} onChange={this.handleChange.bind(this)} fullWidth={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Profile link (TMNT)" name="backgroundUrl" value={this.state.delegatee.backgroundUrl} onChange={this.handleChange.bind(this)} fullWidth={true} />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="Image URL" name="imageUrl" value={this.state.delegatee.imageUrl} onChange={this.handleChange.bind(this)} fullWidth={true} />
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