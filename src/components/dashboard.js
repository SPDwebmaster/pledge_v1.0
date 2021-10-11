import React from 'react';
import autobind from 'class-autobind';
import { readRemoteFile } from 'react-papaparse';
import DataStore from '../datastore'
import Marks from './marks'
import './dashboard.css'
import axios from 'axios'

export default class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {pc: null};
        autobind(this);
        this.getData();
    }

    setData(pledges) {
        this.setState({pc: pledges})
    }

    async getData() {
        readRemoteFile("https://docs.google.com/spreadsheets/d/e/2PACX-1vRiZAFMM0rkejqhWxGIwuW___MGrYHmmIjw57v1pubLIMiJtaGY6iLvfCTMMkHiabF1Qs5j-k_R4dFt/pub?gid=1605365040&single=true&output=csv", {
            complete: (results) => {
                let pledge_data = results.data[0]
                let pledge_class_name = pledge_data[0]
                
                this.props.setPledgeClassName(pledge_class_name + " Pledge Class")

                let pledges = []
                let pledge_dict = {}
                
                for (let i = 2; i < pledge_data.length; i++) {
                    let pledge = new Pledge(pledge_data[i])
                    pledge_dict[pledge.name] = pledge
                    pledges.push(pledge)
                }

                
                readRemoteFile('https://docs.google.com/spreadsheets/d/e/2PACX-1vRiZAFMM0rkejqhWxGIwuW___MGrYHmmIjw57v1pubLIMiJtaGY6iLvfCTMMkHiabF1Qs5j-k_R4dFt/pub?output=csv', {
                    complete: (results) => {

                        for (let i = 1; i < results.data.length; i++) {
                            let x = results.data[i]
                            let pledge_name = x[3]
                            if (pledge_name in pledge_dict) {
                                if (x[7] == "yes")
                                    pledge_dict[x[3]].marks.push({date: x[0], brother: x[2], pledge: x[3], type: x[4], count: parseInt(x[5]), desc: x[6], approved: x[7]})
                            } else {
                                console.log("Unknown pledge: " + pledge_name)
                            }
                        }
                        this.setData(pledges)
                        return
                    },
                });


            },
          });
      
        //let pledge_class = await DataStore.getMarks();
        //await DataStore.getPledges();
        //this.setState({pc: pledge_class});
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
                    <td className="details">{m.brother + ' - ' + m.desc}</td>
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
                pledges = pledges.concat(MarkDetails(p.marks));
            }
        })
            
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

class Mark {
    constructor(date, brother, pledge, type, count, desc, approved) {
    this.date = date
    this.brother = brother
    this.pledge = pledge
    this.type = type
    this.count = count
    this.desc = desc
    this.approved = approved
    }
}

class Pledge {
    constructor(name) {
        this.name = name;
        this.marks = [];
    }

    getTotal(type) {
        let total = 0;
        for (let i in this.marks) {
            if (this.marks[i].type === type)
                total += this.marks[i].count;
        }

        return total;
    }
}