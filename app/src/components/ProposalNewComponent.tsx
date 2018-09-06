import * as React from 'react';
import {Proposal} from '../modules/LiquidDecisions'
import * as LiquidDecisions from '../modules/LiquidDecisions'

type Props = {
    //onSave: Function | undefined
    //onCancel: Function | undefined
}

export class ProposalNew extends React.Component <Props, any> {
    key: string

	constructor(props) {
		super(props);
		this.state = {
            title: 'Title',
            uri: '',
            duration: 0,
            tag: ''     
        }
        //this.handleChange = this.handleChange.bind(this)
        //this.save = this.save.bind(this)
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

    save() {
        LiquidDecisions.Contract.makeProposal(this.state.title, this.state.uri, this.state.duration, this.state.tag)
    }

    public render(): React.ReactNode {
        return (
            <div className="proposalNew">
                <form>
                    <label>
                        Title
                        <input type="text" name="title" value={this.state.title} onChange={this.handleChange.bind(this)} />
                    </label>
                    <label>
                        URL
                        <input type="text" name="uri" value={this.state.uri} onChange={this.handleChange.bind(this)} />
                    </label>
                    <label>
                        Duration
                        <input type="number" name="duration" value={this.state.duration} onChange={this.handleChange.bind(this)} />
                    </label>
                    <label>
                        Tag
                        <input type="text" name="tag" value={this.state.tag} onChange={this.handleChange.bind(this)} />
                    </label>
                </form>
                <button onClick={this.save.bind(this)}>Save</button>
            </div>
        )
    }
}