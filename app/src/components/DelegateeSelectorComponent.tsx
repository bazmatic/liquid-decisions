import * as React from 'react'
import ProposalComponent from './ProposalComponent'
import {Delegatee} from '../modules/LiquidDecisions'

type Props = {
    onSelect: Function
    delegatees: Delegatee[]
}

export class DelegateeSelectorComponent extends React.Component <Props, { delegatees: Delegatee[] }> {
    
	constructor(props) {
		super(props);
		this.state = { delegatees: props.delegatees };
    }

    componentWillReceiveProps(newProps) {
        console.log('DelegateeSelector.componentWillReceiveProps():', newProps)
        this.setState(newProps);
    }

    public selectItem(delegatee: Delegatee) {
        this.props.onSelect(delegatee)
    }

    render() {
        let delegatees: React.ReactNode[]
        var number = 0;
        console.log('DelegateeSelector.render():', this.state)

        delegatees = this.state.delegatees.map((delegateeData: Delegatee)=>{
            number ++;
            return <ul className="delegatee">
                <li onClick={this.selectItem.bind}>{delegateeData.name} {delegateeData.address}</li>
            
            </ul>
        });   
                
		return (
			<div className="delegateSelector">
                {delegatees.length} available delegatees
                {delegatees}
			</div>
		);
    }

	handleError(err) {
		console.error(err);
	}
}
