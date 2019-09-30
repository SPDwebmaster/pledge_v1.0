import React from 'react';
import autobind from 'class-autobind';
import DataStore from '../datastore'
import Marks from './marks'
import './dashboard.css'

export default class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pc: null};
        autobind(this);
        this.getData();
    }

    async getData() {
        let pledge_class = await DataStore.getMarks();
        await DataStore.getPledges();
        this.setState({pc: pledge_class});
    }

    openPledge(pledge) {
        this.setState({open: pledge.name});
    }

    render() {
        let pc = this.state.pc;
        let open = this.state.open;

        if (!pc)
            return (
            <div className="dash">
                <div className="loader"/>
            </div>);

        let MarkDetails = (marks) => {
            let details = []
            marks.forEach(m => {
                details.push(
                <tr key={m.desc} className="details">
                    <td><Marks type={m.type} count={m.count}/></td>
                    <td className="details">{m.date}</td>
                    <td className="details">{m.desc}</td>
                </tr>)
            });
            return details;
        }

        let Pledge = (pledge) => {
            return(
                <tr key={pledge.name} onClick={() => this.openPledge(pledge)}>
                    <td>{pledge.name}</td>
                    <td><Marks type="black" count={pledge.getTotal("black")}/></td>
                    <td><Marks type="white" count={pledge.getTotal("white")}/></td>
                </tr>)
        }

        let pledges = [];
        pc.forEach(p => {
            pledges.push(Pledge(p));
            if (open === p.name) {
                console.log(p.name);
                pledges = pledges.concat(MarkDetails(p.marks));
            }
        })
        console.log(pledges);
            
        return(
            <div className="dash">
                <table>
                    <tbody>
                        <tr>
                            <th width="25%">
                                pledge
                            </th>
                            <th width="20%">
                                black
                            </th>
                            <th >
                                white
                            </th>
                        </tr>
                        {pledges}
                    </tbody>
                </table>
                <br></br>
            </div>
        )
    }
}