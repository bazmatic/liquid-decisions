import * as React from 'react';
import * as LiquidDecisions from '../modules/LiquidDecisions'
import { TextField, Button, Paper, Grid } from '@material-ui/core'

type Props = {
    onSave: Function | undefined
    //onCancel: Function | undefined
}

export class ProposalNew extends React.Component <Props, any> {
    key: string

	constructor(props) {
		super(props);
		this.state = {
            title: '',
            uri: '',
            duration: 7,
            tag: ''     
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
        let result = await LiquidDecisions.Contract.makeProposal(this.state.title, this.state.uri, this.state.duration, this.state.tag)
        console.log("Sent proposal:", result)
        //TODO: Use Drizzle to wait for confirmation
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

                    <Grid item lg={12} md={12} xl={12} xs={12}>
                        <TextField label="Title" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} fullWidth={true}  />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="URL" name="uri" value={this.state.uri} onChange={this.handleChange.bind(this)} fullWidth={true} />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Duration (days)" type="number" name="duration" value={this.state.duration} onChange={this.handleChange.bind(this)} fullWidth={true}  />  
                    </Grid>
                    <Grid item xs={6}>
                        <TextField label="Tag" type="text" name="tag" value={this.state.tag} onChange={this.handleChange.bind(this)} fullWidth={true}  />
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