import * as React from 'react'
import  { Delegatee } from '../modules/LiquidDecisions'
//im//port './ThreadViewer.css';

type Props = {
    delegatees: Delegatee[],
    onSelect?: Function
}

export class DelegateeList extends React.Component <Props, { delegatees: Delegatee[] }> {
    
    private onSelect: Function
    
    constructor(props) {
		super(props);
        this.state = props;
        this.onSelect = props.onSelect ||  (()=>{})
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    public selectItem(delegatee: Delegatee) {
        this.props.onSelect(delegatee)
    }

    render() {
        let delegatees: any[] = this.state.delegatees.map((delegateeData: Delegatee)=>{
            return <li onClick={this.selectItem.bind(this, delegateeData)}>{delegateeData.name}</li>
        });   
              
		return (
			<div className="DelegateeList">
                {delegatees.length} delegatees
                <ul>                   
                    {delegatees}
                </ul>
			</div>
		);
    }

	handleError(err) {
		console.error(err);
	}
}
