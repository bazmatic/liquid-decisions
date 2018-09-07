import * as React from 'react';
import {Proposal} from '../modules/LiquidDecisions'
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
    }

    public render(): React.ReactNode {
        return (
            <div className="delegateeNew">
                <form>
                    <label>
                        Name
                        <input type="text" name="name" value={this.state.name} onChange={this.handleChange.bind(this)} />
                    </label>
                    <label>
                        Email
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange.bind(this)} />
                    </label>
                </form>
                <button onClick={this.save.bind(this)}>Save</button>
            </div>
        )
    }
}